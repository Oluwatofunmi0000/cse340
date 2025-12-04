const bcrypt = require("bcryptjs");
const accountModel = require("../models/account-model");
const utilities = require("../utilities");
const { validationResult } = require("express-validator");
const { createToken } = require("../utilities/jwt");

const accountCont = {};

/* ****************************************
*  Deliver registration view
* *************************************** */
accountCont.buildRegister = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: [],
  });
};

/* ****************************************
*  Process Registration
* *************************************** */
accountCont.registerAccount = async function (req, res) {
  try {
    let nav = await utilities.getNav();
    const errors = validationResult(req);
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).render("account/register", {
        title: "Register",
        nav,
        errors: errors.array(),
        account_firstname,
        account_lastname,
        account_email,
      });
    }

    // Check if email exists
    const emailExists = await accountModel.checkExistingEmail(account_email);
    if (emailExists) {
      return res.status(400).render("account/register", {
        title: "Register",
        nav,
        errors: [{ msg: "Email already in use. Please login or use a different email." }],
        account_firstname,
        account_lastname,
        account_email,
      });
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(account_password, 10);
    } catch (error) {
      return res.status(500).render("account/register", {
        title: "Register",
        nav,
        errors: [{ msg: "Failed to process password." }],
        account_firstname,
        account_lastname,
        account_email,
      });
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult && regResult.rows && regResult.rows[0]) {
      req.session.message = `Registration successful! Please log in, ${account_firstname}.`;
      return res.status(201).redirect("/account/login");
    }

    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: [{ msg: "Registration failed. Please try again." }],
      account_firstname,
      account_lastname,
      account_email,
    });
  } catch (error) {
    console.error("registerAccount error:", error);
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email } = req.body;
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: [{ msg: "An error occurred during registration: " + error.message }],
      account_firstname,
      account_lastname,
      account_email,
    });
  }
};

/* ****************************************
*  Deliver login view
* *************************************** */
accountCont.buildLogin = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: [],
  });
};

/* ****************************************
*  Process login
* *************************************** */
accountCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav();
  const errors = validationResult(req);
  const { account_email, account_password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email,
    });
  }

  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: [{ msg: "Invalid email or password." }],
      account_email,
    });
  }

  const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
  if (!passwordMatch) {
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: [{ msg: "Invalid email or password." }],
      account_email,
    });
  }

  // Create JWT
  const payload = {
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_type: accountData.account_type,
  };
  const token = createToken(payload);
  res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

  res.redirect("/account/");
};

/* ****************************************
*  Deliver account management view
* *************************************** */
accountCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
  });
};

/* ****************************************
*  Deliver account update view
* *************************************** */
accountCont.buildUpdate = async function (req, res) {
  const account_id = parseInt(req.params.id);
  let nav = await utilities.getNav();
  const accountData = await accountModel.getAccountById(account_id);
  if (!accountData) {
    req.session.message = "Account not found.";
    return res.redirect("/account/");
  }
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: [],
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  });
};

/* ****************************************
*  Process account update
* *************************************** */
accountCont.updateAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const errors = validationResult(req);
  const { account_firstname, account_lastname, account_email, account_id } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }

  // Check if email changed and if new email exists
  const currentAccount = await accountModel.getAccountById(account_id);
  if (currentAccount.account_email !== account_email) {
    const emailExists = await accountModel.checkExistingEmail(account_email);
    if (emailExists) {
      return res.status(400).render("account/update", {
        title: "Update Account",
        nav,
        errors: [{ msg: "Email already in use." }],
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  }

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );

  if (updateResult) {
    // Update JWT with new data
    const updatedAccount = await accountModel.getAccountById(account_id);
    const payload = {
      account_id: updatedAccount.account_id,
      account_firstname: updatedAccount.account_firstname,
      account_lastname: updatedAccount.account_lastname,
      account_email: updatedAccount.account_email,
      account_type: updatedAccount.account_type,
    };
    const token = createToken(payload);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

    req.session.message = "Account updated successfully.";
    return res.redirect("/account/");
  }

  res.status(500).render("account/update", {
    title: "Update Account",
    nav,
    errors: [{ msg: "Update failed. Please try again." }],
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  });
};

/* ****************************************
*  Process password update
* *************************************** */
accountCont.updatePassword = async function (req, res) {
  let nav = await utilities.getNav();
  const errors = validationResult(req);
  const { account_password, account_id } = req.body;

  const accountData = await accountModel.getAccountById(account_id);

  if (!errors.isEmpty()) {
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: [{ msg: "Failed to process password." }],
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }

  const updateResult = await accountModel.updatePassword(hashedPassword, account_id);

  if (updateResult) {
    req.session.message = "Password updated successfully.";
    return res.redirect("/account/");
  }

  res.status(500).render("account/update", {
    title: "Update Account",
    nav,
    errors: [{ msg: "Password update failed. Please try again." }],
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  });
};

/* ****************************************
*  Process logout
* *************************************** */
accountCont.logout = function (req, res) {
  res.clearCookie("jwt");
  req.session.message = "You have been logged out.";
  res.redirect("/");
};

module.exports = accountCont;
