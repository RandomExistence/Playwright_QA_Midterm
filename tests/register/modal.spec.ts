import { test, expect } from '@playwright/test'
import { RegPage } from '../../pages/regPage'
import { ValidData, InvalidData, Constant, FilePath, Assertion  } from '../../data/regData';
import { RegPageUtils } from '../../pages/utils/regPageUtils'

const validData = new ValidData();
const invalidData = new InvalidData();
const constant = new Constant();
const filePath = new FilePath('./');
const assertion = new Assertion();

test.describe('modal shows correct information in correct format', async () => {
  let regPage: RegPage;
  test.beforeEach(async ({ page }) => {
    regPage = new RegPage(page);
    await regPage.goto();
  });

  test('some inputs are blank/deleted before submission', async () => {
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
  test('all inputs are have one value or more value', async () => {
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

// ---------------------------------------- EXPECTED TO FAIL ---------------------------------------- //

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