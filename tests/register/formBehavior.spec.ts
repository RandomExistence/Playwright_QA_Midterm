import { test, expect } from '@playwright/test'
import { RegPage } from '../../pages/regPage'
import { ValidData, InvalidData, Constant, FilePath, Assertion  } from '../../data/regData';
import { RegPageUtils } from '../../pages/utils/regPageUtils'

const validData = new ValidData();
const invalidData = new InvalidData();
const constant = new Constant();
const filePath = new FilePath('./');
const assertion = new Assertion();

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

test('user can submit the form with all valid data', async ({ page }) => {
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

test('invalid fields should prevent user from submitting the form', async ({ page }) => {
  const regPage = new RegPage(page);
  const regPageUtils = new RegPageUtils(regPage);
  await regPage.goto();

  // blank page
  await regPage.clickSubmitButton();
  await expect(regPage.summarySubmitModal).not.toBeVisible();

  // gender invalid
  await regPage.fillFirstname(validData.firstname_default);
  await regPage.fillLastname(validData.lastname_default);
  await regPage.fillMobile(validData.mobile_default);
  await regPage.clickSubmitButton();
  await expect(regPage.summarySubmitModal).not.toBeVisible();

  // firstname invalid
  await regPageUtils.fillAllRequiredFields();
  await regPage.fillFirstname(invalidData.empty);
  await regPage.clickSubmitButton();
  await expect(regPage.summarySubmitModal).not.toBeVisible();

  // lastname invalid
  await regPageUtils.fillAllRequiredFields();
  await regPage.fillLastname(invalidData.empty);
  await regPage.clickSubmitButton();
  await expect(regPage.summarySubmitModal).not.toBeVisible();

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
