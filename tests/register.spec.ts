import { test, expect } from '@playwright/test'
import { RegPage } from '../pages/regPage'
import { ValidData, InvalidData, Constant, FilePath, Assertion  } from '../data/regData';
import { RegPageUtils } from '../pages/utils/regPageUtils'

const validData = new ValidData();
const invalidData = new InvalidData();
const constant = new Constant();
const filePath = new FilePath('./');
const assertion = new Assertion();

/*
=======================================================================================================
  This is Random Existence writing:
  When executing every tests, it is advisable to run
  > set TEST_TIMEOUT=90000 && npx playwright test --workers=2 // numbers are adjustable
  rather than
  > npx playwright test
  sometimes, goto() does not even navigate due to computer hardware and network going up in flames
=======================================================================================================
*/

test('user can successfully submit the form with all valid data', async ({ page }) => {
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

  await expect(regPage.summarySubmitModal).toBeVisible();
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

test.describe('birthday is selectable via datepicker dialog', async () => {
  test('select the first day on the datepicker', async ({ page }) => {
    const regPage = new RegPage(page)
    await regPage.goto();
    await regPage.selectBirthdate('1','January','1900');
    await expect(regPage.birthdateTextInput).toHaveValue(/01 Jan 1900/);
  })
  
  test('select the last day on the datepicker', async ({ page }) => {
    const regPage = new RegPage(page)
    await regPage.goto();
    await regPage.selectBirthdate('31','December','2100');
    await expect(regPage.birthdateTextInput).toHaveValue(/31 Dec 2100/);
  })

  test('select day from 1 to 31', async ({ page }) => {
    const regPage = new RegPage(page)
    await regPage.goto();
    for (var day of constant.DAYS_1_TO_31) {
      await regPage.selectBirthdate(`${day}`,'March','2000');
      await expect(regPage.birthdateTextInput).toHaveValue(new RegExp(`${day} Mar 2000`));
    }
  })
  
  test('select month from January to December', async ({ page }) => {
    const regPage = new RegPage(page)
    await regPage.goto();
    for (var month of constant.MONTHS_JAN_TO_DEC) {
      await regPage.selectBirthdate('1',month,'2000');
      await expect(regPage.birthdateTextInput).toHaveValue(new RegExp(`1 ${month.substring(0,3)} 2000`));
    }
  })

  test('select year from 1900 to 2100', async ({ page }) => {
    const regPage = new RegPage(page)
    await regPage.goto();
    test.setTimeout(120000); // 120 seconds, the normal timeout is 30s which is not sufficient for this test
    for (var year of constant.YEARS_1900_TO_2100) {
      await regPage.selectBirthdate('1','March',year);
      await expect(regPage.birthdateTextInput).toHaveValue(new RegExp(`1 Mar ${year}`));
    }
  })
  
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
    await expect(regPage.subjectOptionPill.filter({ hasText: constant.COMPUTER_SCIENCE })).toHaveCount(0); // .subjectOptionPill resolves to multiple element and .not.toContainText breaks due to that
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
    await regPage.cityDropdownContainer.click(); // to popup the list
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
  test('email requires domain to be longer than 1 character', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillEmail(invalidData.email_domain_too_short);
    await regPage.clickSubmitButton();
    await expect(regPage.emailTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
  test('email requires domain to be shorter than 7 character', async ({ page }) => {
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
    // we are going with this route due me not being able to find the element that contains the file name when uploaded,
    // therefore, we are relying on the summary modal to confirm the validity of uploaded file.
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

test('gender input allows only one selection', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();

    await regPage.selectGender(constant.MALE);
    await expect(regPage.gendermaleRadioButton).toBeChecked();
    await expect(regPage.genderfemaleRadioButton).not.toBeChecked();
    await expect(regPage.genderotherRadioButton).not.toBeChecked();
    await regPage.selectGender(constant.FEMALE);
    await expect(regPage.gendermaleRadioButton).not.toBeChecked();
    await expect(regPage.genderfemaleRadioButton).toBeChecked();
    await expect(regPage.genderotherRadioButton).not.toBeChecked();
    await regPage.selectGender(constant.OTHER);
    await expect(regPage.gendermaleRadioButton).not.toBeChecked();
    await expect(regPage.genderfemaleRadioButton).not.toBeChecked();
    await expect(regPage.genderotherRadioButton).toBeChecked();
})

test.describe('hobbies input allows one selection, multiple selection and deselection', async () => {
  test('select one', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.selectHobby(constant.SPORTS);
    await expect(regPage.hobbysportCheckbox).toBeChecked();
    await expect(regPage.hobbyreadingCheckbox).not.toBeChecked();
    await expect(regPage.hobbymusicCheckbox).not.toBeChecked();
  })
  test('select multiple', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.selectHobby(constant.SPORTS);
    await expect(regPage.hobbysportCheckbox).toBeChecked();
    await expect(regPage.hobbyreadingCheckbox).not.toBeChecked();
    await expect(regPage.hobbymusicCheckbox).not.toBeChecked();
    await regPage.selectHobby(constant.MUSIC);
    await expect(regPage.hobbysportCheckbox).toBeChecked();
    await expect(regPage.hobbyreadingCheckbox).not.toBeChecked();
    await expect(regPage.hobbymusicCheckbox).toBeChecked();
    await regPage.selectHobby(constant.READING);
    await expect(regPage.hobbysportCheckbox).toBeChecked();
    await expect(regPage.hobbyreadingCheckbox).toBeChecked();
    await expect(regPage.hobbymusicCheckbox).toBeChecked();
  })
  test('deselect', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.selectHobby(constant.SPORTS);
    await regPage.selectHobby(constant.SPORTS);
    await expect(regPage.hobbysportCheckbox).not.toBeChecked();
  })
})

test.describe('address input allows valid values', async () => {
  test('address input allows new line', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillCurrentaddress(validData.currentaddress_with_newline);
    await expect(regPage.currentaddressTextInput).toHaveValue(validData.currentaddress_with_newline);
  })
  test('address input allows number', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillCurrentaddress(validData.currentaddress_with_number);
    await expect(regPage.currentaddressTextInput).toHaveValue(validData.currentaddress_with_number);
  })
})

test.describe('modal shows correct information in correct format', async () => {
  test('some inputs are blank/deleted before submission', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();

    await regPage.fillFirstname(validData.firstname_default);
    await regPage.fillLastname(validData.lastname_default);
    await regPage.fillEmail(validData.email_default);
    await regPage.fillBirthdate(validData.birthdate_default);
    await regPage.fillMobile(validData.mobile_default);
    await regPage.selectGender(constant.MALE);
    await regPage.selectState(constant.HARYANA);
    await regPage.selectCity(constant.PANIPAT);

    await regPage.selectSubjectPill(constant.COMPUTER_SCIENCE);
    await regPage.removeSubjectPill(constant.COMPUTER_SCIENCE);
    await regPage.selectHobby(constant.SPORTS);
    await regPage.selectHobby(constant.SPORTS);
    await regPage.fillCurrentaddress(validData.currentaddress_default);
    await regPage.fillCurrentaddress(validData.blank);
    
    await regPage.clickSubmitButton();
    await expect(regPage.summarySubmitModal).toBeVisible();
    await expect(regPage.studentnameModalRow.locator('td').nth(1)).toHaveText(`${validData.firstname_default} ${validData.lastname_default}`)
    await expect(regPage.studentemailModalRow.locator('td').nth(1)).toHaveText(validData.email_default)
    await expect(regPage.genderModalRow.locator('td').nth(1)).toHaveText(constant.MALE)
    await expect(regPage.mobileModalRow.locator('td').nth(1)).toHaveText(validData.mobile_default)
    await expect(regPage.dateofbirthModalRow.locator('td').nth(1)).toHaveText(assertion.modal_dateofbirth_default)
    await expect(regPage.subjectsModalRow.locator('td').nth(1)).toHaveText('')
    await expect(regPage.hobbiesModalRow.locator('td').nth(1)).toHaveText('')
    await expect(regPage.pictureModalRow.locator('td').nth(1)).toHaveText('')
    await expect(regPage.addressModalRow.locator('td').nth(1)).toHaveText('')
    await expect(regPage.stateandcityModalRow.locator('td').nth(1)).toHaveText(`${constant.HARYANA} ${constant.PANIPAT}`)
  })
  test('all inputs are have one value or more value', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();

    await regPage.fillFirstname(validData.firstname_default);
    await regPage.fillLastname(validData.lastname_default);
    await regPage.fillEmail(validData.email_default);
    await regPage.selectGender(constant.MALE);
    await regPage.fillMobile(validData.mobile_default);
    await regPage.fillBirthdate(validData.birthdate_default);
    await regPage.selectSubjectPill(constant.COMPUTER_SCIENCE);
    await regPage.selectSubjectPill(constant.ECONOMICS);
    await regPage.selectSubjectPill(constant.ACCOUNTING);
    await regPage.selectHobby(constant.SPORTS);
    await regPage.selectHobby(constant.MUSIC);
    await regPage.uploadPicture(filePath.one_mb_png_file);
    await regPage.fillCurrentaddress(validData.currentaddress_default);
    await regPage.selectState(constant.HARYANA);
    await regPage.selectCity(constant.PANIPAT);

    await regPage.clickSubmitButton();
    await expect(regPage.summarySubmitModal).toBeVisible();
    await expect(regPage.studentnameModalRow.locator('td').nth(1)).toHaveText(`${validData.firstname_default} ${validData.lastname_default}`)
    await expect(regPage.studentemailModalRow.locator('td').nth(1)).toHaveText(validData.email_default)
    await expect(regPage.genderModalRow.locator('td').nth(1)).toHaveText(constant.MALE)
    await expect(regPage.mobileModalRow.locator('td').nth(1)).toHaveText(validData.mobile_default)
    await expect(regPage.dateofbirthModalRow.locator('td').nth(1)).toHaveText(assertion.modal_dateofbirth_default)
    await expect(regPage.subjectsModalRow.locator('td').nth(1)).toHaveText(`${constant.COMPUTER_SCIENCE}, ${constant.ECONOMICS}, ${constant.ACCOUNTING}`)
    await expect(regPage.hobbiesModalRow.locator('td').nth(1)).toHaveText(`${constant.SPORTS}, ${constant.MUSIC}`)
    await expect(regPage.pictureModalRow.locator('td').nth(1)).toHaveText(assertion.one_mb_png_file)
    await expect(regPage.addressModalRow.locator('td').nth(1)).toHaveText(validData.currentaddress_default)
    await expect(regPage.stateandcityModalRow.locator('td').nth(1)).toHaveText(`${constant.HARYANA} ${constant.PANIPAT}`)
  })
})

test('the page appears blank(expect Date of Birth field) upon navigation', async ({ page }) => {
  const regPage = new RegPage(page);
  await regPage.goto();

  await expect(regPage.firstnameTextInput).toBeEmpty();
  await expect(regPage.lastnameTextInput).toBeEmpty();
  await expect(regPage.emailTextInput).toBeEmpty();
  await expect(regPage.mobileTextInput).toBeEmpty();
  await expect(regPage.currentaddressTextInput).toBeEmpty();
  await expect(regPage.subjectOptionContainer).toBeEmpty();

  await expect(regPage.statePlaceholderDiv).toBeVisible(); // this div is hidden or possibly detached once an option is chosen
  await expect(regPage.cityPlaceholderDiv).toBeVisible();  // this div is hidden or possibly detached once an option is chosen

  await expect(regPage.gendermaleRadioButton).not.toBeChecked();
  await expect(regPage.genderfemaleRadioButton).not.toBeChecked();
  await expect(regPage.genderotherRadioButton).not.toBeChecked();
  await expect(regPage.hobbysportCheckbox).not.toBeChecked();
  await expect(regPage.hobbyreadingCheckbox).not.toBeChecked();
  await expect(regPage.hobbymusicCheckbox).not.toBeChecked();
})

// ---------------------------------------- EXPECTED TO FAIL ---------------------------------------- //
// one test is skipped
test.describe('firstname input allows only alphabets and spaces', async () => {
  test('firstname with only alphabet', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillFirstname(validData.firstname_without_space);
    await regPage.clickSubmitButton();
    await expect(regPage.firstnameTextInput).toHaveCSS(assertion.css_border_color, assertion.color_green_valid);
  })
  test('firstname with alphabet and space', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillFirstname(validData.firstname_with_space);
    await regPage.clickSubmitButton();
    await expect(regPage.firstnameTextInput).toHaveCSS(assertion.css_border_color, assertion.color_green_valid);
  })
  test('firstname with non-alphabetical characters', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillFirstname(invalidData.firstname_has_nonalphabet);
    await regPage.clickSubmitButton();
    await expect(regPage.firstnameTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
})
// one test is skipped
test.describe('lastname input allows only alphabets and spaces', async () => {
  test('lastname with only alphabet', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillLastname(validData.lastname_without_space);
    await regPage.clickSubmitButton();
    await expect(regPage.lastnameTextInput).toHaveCSS(assertion.css_border_color, assertion.color_green_valid);
  })
  test('lastname with alphabet and space', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillLastname(validData.lastname_with_space);
    await regPage.clickSubmitButton();
    await expect(regPage.lastnameTextInput).toHaveCSS(assertion.css_border_color, assertion.color_green_valid);
  })
  test('lastname with non-alphabetical characters', async ({ page }) => {
    const regPage = new RegPage(page);
    await regPage.goto();
    await regPage.fillLastname(invalidData.lastname_has_nonalphabet);
    await regPage.clickSubmitButton();
    await expect(regPage.lastnameTextInput).toHaveCSS(assertion.css_border_color, assertion.color_red_error);
  })
})
// this test is skipped
test('clear all input fields after clicking close button on the modal', async ({ page }) => {
  const regPage = new RegPage(page);
  await regPage.goto();

  await regPage.fillFirstname(validData.firstname_default);
  await regPage.fillLastname(validData.lastname_default);
  await regPage.fillEmail(validData.email_default);
  await regPage.selectGender(constant.MALE);
  await regPage.fillMobile(validData.mobile_default);
  await regPage.fillBirthdate(validData.birthdate_default);
  await regPage.selectSubjectPill(constant.COMPUTER_SCIENCE);
  await regPage.selectSubjectPill(constant.ECONOMICS);
  await regPage.selectSubjectPill(constant.ACCOUNTING);
  await regPage.selectHobby(constant.SPORTS);
  await regPage.selectHobby(constant.MUSIC);
  await regPage.uploadPicture(filePath.one_mb_png_file);
  await regPage.fillCurrentaddress(validData.currentaddress_default);
  await regPage.selectState(constant.HARYANA);
  await regPage.selectCity(constant.PANIPAT);

  await regPage.clickSubmitButton();
  await expect(regPage.summarySubmitModal).toBeVisible();
  await regPage.clickCloseModalButton();
  await expect(regPage.summarySubmitModal).not.toBeVisible();

  await expect(regPage.firstnameTextInput).toBeEmpty();
  await expect(regPage.lastnameTextInput).toBeEmpty();
  await expect(regPage.emailTextInput).toBeEmpty();
  await expect(regPage.mobileTextInput).toBeEmpty();
  await expect(regPage.currentaddressTextInput).toBeEmpty();
  await expect(regPage.subjectOptionContainer).toBeEmpty();

  await expect(regPage.statePlaceholderDiv).toBeVisible(); // this div is hidden or possibly detached once an option is chosen
  await expect(regPage.cityPlaceholderDiv).toBeVisible();  // this div is hidden or possibly detached once an option is chosen

  await expect(regPage.gendermaleRadioButton).not.toBeChecked();
  await expect(regPage.genderfemaleRadioButton).not.toBeChecked();
  await expect(regPage.genderotherRadioButton).not.toBeChecked();
  await expect(regPage.hobbysportCheckbox).not.toBeChecked();
  await expect(regPage.hobbyreadingCheckbox).not.toBeChecked();
  await expect(regPage.hobbymusicCheckbox).not.toBeChecked();
})