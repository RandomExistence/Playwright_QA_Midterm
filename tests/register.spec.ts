import { test, expect } from '@playwright/test'
import { RegPage } from '../pages/regPage'
import { ValidData, InvalidData, Constant, FilePath, Assertion  } from '../data/regData';
import { RegPageUtils } from '../pages/utils/regPageUtils'

const validData = new ValidData();
const invalidData = new InvalidData();
const constant = new Constant();
const filePath = new FilePath('./');
const assertion = new Assertion();

test('user can successfully submit the form with all valid data.', async ({ page }) => {
  const regPage = new RegPage(page);
  await regPage.goto();

  await regPage.fillFirstname(validData.firstname_default);
  await regPage.fillLastname(validData.lastname_default);
  await regPage.fillEmail(validData.email_default);
  await regPage.selectGender(constant.MALE);
  await regPage.fillMobile(validData.mobile_default);
  await regPage.fillBirthdate(validData.birthdate_default);
  await regPage.selectSubjectPill(constant.COMPUTER_SCIENCE);
  await regPage.selectHobby(constant.SPORTS);
  await regPage.uploadPicture(filePath.ten_mb_jpg_file);
  await regPage.fillCurrentaddress(validData.currentaddress_default);
  await regPage.selectState(constant.NCR);
  await regPage.selectCity(constant.DELHI);
  await regPage.clickSubmitButton();

  await expect(regPage.summarySubmitModal).toBeInViewport();
})

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

test('invalid fields should prevent user from submitting the form', async ({ page }) => {
  const regPage = new RegPage(page);
  const regPageUtils = new RegPageUtils(regPage, validData, invalidData, constant, filePath, assertion);
  await regPage.goto();

  // blank page
  await regPage.clickSubmitButton();
  await expect(regPage.summarySubmitModal).not.toBeInViewport();

  // gender invalid
  await regPage.fillFirstname(validData.firstname_default);
  await regPage.fillLastname(validData.lastname_default);
  await regPage.fillMobile(validData.mobile_default);
  await regPage.clickSubmitButton();
  await expect(regPage.summarySubmitModal).not.toBeInViewport();

  // firstname invalid
  await regPageUtils.fillAllRequiredFields();
  await regPage.fillFirstname(invalidData.empty);
  await regPage.clickSubmitButton();
  await expect(regPage.summarySubmitModal).not.toBeInViewport();

  // lastname invalid
  await regPageUtils.fillAllRequiredFields();
  await regPage.fillLastname(invalidData.empty);
  await regPage.clickSubmitButton();
  await expect(regPage.summarySubmitModal).not.toBeInViewport();

  // email invalid
  await regPageUtils.fillAllRequiredFields();
  await regPage.fillEmail(invalidData.email_no_at);
  await regPage.clickSubmitButton();
  await expect(regPage.summarySubmitModal).not.toBeVisible();

  // mobile invalid
  await regPageUtils.fillAllRequiredFields();
  await regPage.fillMobile(invalidData.mobile_has_character);
  await regPage.clickSubmitButton();
  await expect(regPage.summarySubmitModal).not.toBeVisible();
})

test('birthday is selectable via datepicker dialog', async ({ page }) => {
  test.setTimeout(150000); // 150 seconds, the normal timeout is 30s which is not sufficient for this test
  const regPage = new RegPage(page)
  await regPage.goto();

  // first day
  await regPage.selectBirthdate('1','January','1900');
  await expect(regPage.birthdateTextInput).toHaveValue(/01 Jan 1900/);

  // last day
  await regPage.selectBirthdate('31','December','2100');
  await expect(regPage.birthdateTextInput).toHaveValue(/31 Dec 2100/);

  // all days
  for (var day of constant.DAYS_1_TO_31) {
    await regPage.selectBirthdate(`${day}`,'March','2000');
    await expect(regPage.birthdateTextInput).toHaveValue(new RegExp(`${day} Mar 2000`));
  }

  // all month
  for (var month of constant.MONTHS_JAN_TO_DEC) {
    await regPage.selectBirthdate('1',month,'2000');
    await expect(regPage.birthdateTextInput).toHaveValue(new RegExp(`1 ${month.substring(0,3)} 2000`));
  }

  // all year
  for (var year of constant.YEARS_1900_TO_2100) {
    await regPage.selectBirthdate('1','March',year);
    await expect(regPage.birthdateTextInput).toHaveValue(new RegExp(`1 Mar ${year}`));
  }
})

test.describe('birthday defaults to today', async () => {
  test('birthday defaults to 31 Dec 2100', async ({ page }) => {
    const regPage = new RegPage(page)
    await regPage.setTime(2100, 11, 31)
    await regPage.goto()
    await expect(regPage.birthdateTextInput).toHaveValue('31 Dec 2100')
  });

  test('birthday defaults to 28 Feb 2000', async ({ page }) => {
    const regPage = new RegPage(page)
    await regPage.setTime(2000, 1, 28)
    await regPage.goto()
    await expect(regPage.birthdateTextInput).toHaveValue('28 Feb 2000')
  });

  test('birthday defaults to 01 Jan 1900', async ({ page }) => {
    const regPage = new RegPage(page)
    await regPage.setTime(1900, 0, 1)
    await regPage.goto()
    await expect(regPage.birthdateTextInput).toHaveValue('01 Jan 1900')
  });
});

test.describe('user can select and remove subjects', async () => {
  test('select one subject', async ({ page }) => {
    const regPage = new RegPage(page)
    await regPage.goto();
    await regPage.selectSubjectPill(constant.ACCOUNTING);
    await expect(regPage.subjectOptionContainer).toContainText(constant.ACCOUNTING);
  })
  test('select all subjects', async ({ page }) => {
    const regPage = new RegPage(page)
    await regPage.goto();
    for (var subject of constant.SUBJECTS_ALL) {
      await regPage.selectSubjectPill(subject);
      await expect(regPage.subjectOptionContainer).toContainText(subject);
    }
  })
  test('remove correct subject', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.selectSubjectPill(constant.HINDI);
    await regPage.selectSubjectPill(constant.COMPUTER_SCIENCE);
    await regPage.selectSubjectPill(constant.COMMERCE);

    await regPage.removeSubjectPill(constant.COMPUTER_SCIENCE);
    await expect(regPage.subjectOptionPill.filter({ hasText: constant.COMPUTER_SCIENCE })).toHaveCount(0);
    await expect(regPage.subjectOptionPill).toContainText([constant.HINDI, constant.COMMERCE]);
  })
  test('remove all subjects', async ({ page }) => {
    const regPage = new RegPage(page)
    await regPage.goto();
    for (var subject of constant.SUBJECTS_ALL) {
      await regPage.selectSubjectPill(subject);
      await expect(regPage.subjectOptionContainer).toContainText(subject);
    }
    for (var subject of constant.SUBJECTS_ALL) {
      await regPage.removeSubjectPill(subject);
      await expect(regPage.subjectOptionPill.filter({ hasText: subject })).toHaveCount(0);
    }
  })
})

test.describe('city options depend on the selected state', async () => {
  test('city is disabled when state is not selected', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await expect(regPage.cityDropdownInput).toBeDisabled();
  })
  test('city options changes based on selected state', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.selectState(constant.HARYANA);
    await regPage.cityDropdownContainer.click();
    await expect(regPage.cityOptionList.getByRole('option', { name: constant.KARNAL })).toBeAttached();
    await expect(regPage.cityOptionList.getByRole('option', { name: constant.PANIPAT })).toBeAttached();

    await regPage.selectState(constant.RAJASTHAN);
    await regPage.cityDropdownContainer.click();
    await expect(regPage.cityOptionList.getByRole('option', { name: constant.JAIPUR })).toBeAttached();
    await expect(regPage.cityOptionList.getByRole('option', { name: constant.JAISELMER })).toBeAttached();
  })
})

test.describe('email input can detect invalid email', async () => {
  test('email requires @ sign', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillEmail(invalidData.email_no_at);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('email requires mail server', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillEmail(invalidData.email_no_mail_server);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('email requires username', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillEmail(invalidData.email_no_username);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('email requires domain', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillEmail(invalidData.email_no_domain);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('email requires domain to be longer than 1 char', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillEmail(invalidData.email_domain_too_short);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('email requires domain to be shorter than 7 char', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillEmail(invalidData.email_domain_too_long);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('email requires domain to contain only alphabets', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillEmail(invalidData.email_domain_has_nonalphabet);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
})

test.describe('mobile input can detect invalid mobile', async () => {
  test('mobile requires input length to be equal to 10' , async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillMobile(invalidData.mobile_has_less_than_10_digits);
    await regPage.clickSubmitButton();
    await expect(regPage.mobileTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('mobile requires all characters to be numeric', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillMobile(invalidData.mobile_has_character);
    await regPage.clickSubmitButton();
    await expect(regPage.mobileTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
})

test.describe('user can upload png and jpg files', async () => {
  test('user can upload 1mb jpg file', async ({ page }) => {
    const regPage = new RegPage(page);
    const regPageUtils = new RegPageUtils(regPage, validData, invalidData, constant, filePath, assertion);
    await regPage.goto();
    await regPageUtils.fillAllRequiredFields();
    await regPage.uploadPicture(filePath.one_mb_jpg_file);
    await regPage.clickSubmitButton();
    await expect(regPage.summarySubmitModal).toBeVisible();
    await expect(regPage.pictureModalRow.locator('td').nth(1)).toHaveText(assertion.one_mb_jpg_file);
  })
  test('user can upload 1mb png file', async ({ page }) => {
    const regPage = new RegPage(page);
    const regPageUtils = new RegPageUtils(regPage, validData, invalidData, constant, filePath, assertion);
    await regPage.goto();
    await regPageUtils.fillAllRequiredFields();
    await regPage.uploadPicture(filePath.one_mb_png_file);
    await regPage.clickSubmitButton();
    await expect(regPage.summarySubmitModal).toBeVisible();
    await expect(regPage.pictureModalRow.locator('td').nth(1)).toHaveText(assertion.one_mb_png_file);
  })
  test('user can upload 10mb jpg file', async ({ page }) => {
    const regPage = new RegPage(page);
    const regPageUtils = new RegPageUtils(regPage, validData, invalidData, constant, filePath, assertion);
    await regPage.goto();
    await regPageUtils.fillAllRequiredFields();
    await regPage.uploadPicture(filePath.ten_mb_jpg_file);
    await regPage.clickSubmitButton();
    await expect(regPage.summarySubmitModal).toBeVisible();
    await expect(regPage.pictureModalRow.locator('td').nth(1)).toHaveText(assertion.ten_mb_jpg_file);
  })
  test('user can upload 10mb png file', async ({ page }) => {
    const regPage = new RegPage(page);
    const regPageUtils = new RegPageUtils(regPage, validData, invalidData, constant, filePath, assertion);
    await regPage.goto();
    await regPageUtils.fillAllRequiredFields();
    await regPage.uploadPicture(filePath.ten_mb_png_file);
    await regPage.clickSubmitButton();
    await expect(regPage.summarySubmitModal).toBeVisible();
    await expect(regPage.pictureModalRow.locator('td').nth(1)).toHaveText(assertion.ten_mb_png_file);
  })
})


//  -- address accept new line address

//  -- the form should be cleared after success submission
//  -- modal correct information
//  -- clear inputs upon close modal

// REFACTOR INTO SUITE