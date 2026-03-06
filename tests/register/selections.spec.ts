import { test, expect } from '@playwright/test'
import { RegPage } from '../../pages/regPage'
import { ValidData, InvalidData, Constant, FilePath, Assertion  } from '../../data/regData';
import { RegPageUtils } from '../../pages/utils/regPageUtils'

const validData = new ValidData();
const invalidData = new InvalidData();
const constant = new Constant();
const filePath = new FilePath('./');
const assertion = new Assertion();

test.describe('city options depend on the selected state', async () => {
  let regPage: RegPage;
  test.beforeEach(async ({ page }) => {
    regPage = new RegPage(page);
    await regPage.goto();
  });

  test('city is disabled when state is not selected', async () => {
    await expect(regPage.cityDropdownInput).toBeDisabled();
  })
  test('city options changes based on selected state', async () => {
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
  let regPage: RegPage;
  test.beforeEach(async ({ page }) => {
    regPage = new RegPage(page);
    await regPage.goto();
  });

  test('select one', async () => {
    await regPage.selectHobby(constant.SPORTS);
    await expect(regPage.hobbysportCheckbox).toBeChecked();
    await expect(regPage.hobbyreadingCheckbox).not.toBeChecked();
    await expect(regPage.hobbymusicCheckbox).not.toBeChecked();
  })
  test('select multiple', async () => {
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
  test('deselect', async () => {
    await regPage.selectHobby(constant.SPORTS);
    await regPage.selectHobby(constant.SPORTS);
    await expect(regPage.hobbysportCheckbox).not.toBeChecked();
  })
})