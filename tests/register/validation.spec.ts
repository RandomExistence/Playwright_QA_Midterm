import { test, expect } from '@playwright/test'
import { RegPage } from '../../pages/regPage'
import { ValidData, InvalidData, Constant, FilePath, Assertion  } from '../../data/regData';
import { RegPageUtils } from '../../pages/utils/regPageUtils'

const validData = new ValidData();
const invalidData = new InvalidData();
const constant = new Constant();
const filePath = new FilePath('./');
const assertion = new Assertion();

test('invalid fields should appear invalid', async ({ page }) => {
  const regPage = new RegPage(page);
  await regPage.goto();

  await regPage.emailTextInput.fill(invalidData.email_no_at);
  await regPage.clickSubmitButton();

  // will probably need a better way to verify invalid ui
  await expect(regPage.firstnameTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  await expect(regPage.lastnameTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  await expect(regPage.mobileTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);

  await expect(regPage.gendermaleRadioButton).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  await expect(regPage.genderfemaleRadioButton).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  await expect(regPage.genderotherRadioButton).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
})

test.describe('email input can detect invalid email', async () => {
  let regPage: RegPage;
  test.beforeEach(async ({ page }) => {
    regPage = new RegPage(page);
    await regPage.goto();
  });

  test('email requires @ sign', async () => {
    await regPage.fillEmail(invalidData.email_no_at);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('email requires mail server', async () => {
    await regPage.fillEmail(invalidData.email_no_mail_server);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('email requires username', async () => {
    await regPage.fillEmail(invalidData.email_no_username);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('email requires domain', async () => {
    await regPage.fillEmail(invalidData.email_no_domain);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('email requires domain to be longer than 1 character', async () => {
    await regPage.fillEmail(invalidData.email_domain_too_short);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('email requires domain to be shorter than 7 character', async () => {
    await regPage.fillEmail(invalidData.email_domain_too_long);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('email requires domain to contain only alphabets', async () => {
    await regPage.fillEmail(invalidData.email_domain_has_nonalphabet);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
})

test.describe('email input allows valid email', () => {
  let regPage: RegPage;
  test.beforeEach(async ({ page }) => {
    regPage = new RegPage(page);
    await regPage.goto();
  });

  test('simple email', async () => {
    await regPage.fillEmail(validData.email_simple);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color,assertion.color_green_valid)
  })
  test('complex email', async () => {
    await regPage.fillEmail(validData.email_complex);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color,assertion.color_green_valid)
  })
})

test.describe('mobile input can detect invalid mobile', async () => {
  let regPage: RegPage;
  test.beforeEach(async ({ page }) => {
    regPage = new RegPage(page);
    await regPage.goto();
  });

  test('mobile requires input length to be equal to 10' , async () => {
    await regPage.fillMobile(invalidData.mobile_has_less_than_10_digits);
    await regPage.clickSubmitButton();
    await expect(regPage.mobileTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('mobile requires all characters to be numeric', async () => {
    await regPage.fillMobile(invalidData.mobile_has_character);
    await regPage.clickSubmitButton();
    await expect(regPage.mobileTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
})

test.describe('mobile input allows valid mobile', () => {
  let regPage: RegPage;
  test.beforeEach(async ({ page }) => {
    regPage = new RegPage(page);
    await regPage.goto();
  });

  test('conventional mobile', async () => {
    await regPage.fillMobile(validData.mobile_conventional);
    await regPage.clickSubmitButton();
    await expect(regPage.mobileTextInput).toHaveCSS(assertion.css_border_color,assertion.color_green_valid)
  })
  test('unconventional mobile', async () => {
    await regPage.fillMobile(validData.mobile_unconventional);
    await regPage.clickSubmitButton();
    await expect(regPage.mobileTextInput).toHaveCSS(assertion.css_border_color,assertion.color_green_valid)
  })
})

test.describe('address input allows valid address', async () => {
  let regPage: RegPage;
  test.beforeEach(async ({ page }) => {
    regPage = new RegPage(page);
    await regPage.goto();
  });

  test('address input allows new line', async () => {
    await regPage.fillCurrentaddress(validData.currentaddress_with_newline);
    await expect(regPage.currentaddressTextInput).toHaveValue(validData.currentaddress_with_newline);
  })
  test('address input allows number', async () => {
    await regPage.fillCurrentaddress(validData.currentaddress_with_number);
    await expect(regPage.currentaddressTextInput).toHaveValue(validData.currentaddress_with_number);
  })
})

// ---------------------------------------- EXPECTED TO FAIL ---------------------------------------- //

test.describe('firstname input allows only alphabets and spaces', async () => {
  let regPage: RegPage;
  test.beforeEach(async ({ page }) => {
    regPage = new RegPage(page);
    await regPage.goto();
  });

  test('firstname with only alphabet', async () => {
    await regPage.fillFirstname(validData.firstname_without_space);
    await regPage.clickSubmitButton();
    await expect(regPage.firstnameTextInput).toHaveCSS(assertion.css_border_color, assertion.color_green_valid);
  })
  test('firstname with alphabet and space', async () => {
    await regPage.fillFirstname(validData.firstname_with_space);
    await regPage.clickSubmitButton();
    await expect(regPage.firstnameTextInput).toHaveCSS(assertion.css_border_color, assertion.color_green_valid);
  })
  test('firstname with non-alphabetical characters', async () => {
    await regPage.fillFirstname(invalidData.firstname_has_nonalphabet);
    await regPage.clickSubmitButton();
    await expect(regPage.firstnameTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
})

test.describe('lastname input allows only alphabets and spaces', async () => {
  let regPage: RegPage;
  test.beforeEach(async ({ page }) => {
    regPage = new RegPage(page);
    await regPage.goto();
  });

  test('lastname with only alphabet', async () => {
    await regPage.fillLastname(validData.lastname_without_space);
    await regPage.clickSubmitButton();
    await expect(regPage.lastnameTextInput).toHaveCSS(assertion.css_border_color, assertion.color_green_valid);
  })
  test('lastname with alphabet and space', async () => {
    await regPage.fillLastname(validData.lastname_with_space);
    await regPage.clickSubmitButton();
    await expect(regPage.lastnameTextInput).toHaveCSS(assertion.css_border_color, assertion.color_green_valid);
  })
  test('lastname with non-alphabetical characters', async () => {
    await regPage.fillLastname(invalidData.lastname_has_nonalphabet);
    await regPage.clickSubmitButton();
    await expect(regPage.lastnameTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
})