import { test, expect } from '@playwright/test'
import { RegPage } from '../../pages/regPage'
import { ValidData, InvalidData, Constant, FilePath, Assertion  } from '../../data/regData';
import { RegPageUtils } from '../../pages/utils/regPageUtils'

const validData = new ValidData();
const invalidData = new InvalidData();
const constant = new Constant();
const filePath = new FilePath('./');
const assertion = new Assertion();

test.describe('user can upload png and jpg files', async () => {
  let regPage: RegPage;
  let regPageUtils: RegPageUtils;
  test.beforeEach(async ({ page }) => {
    regPage = new RegPage(page);
    regPageUtils = new RegPageUtils(regPage);
    await regPage.goto();
  });

  // we are going with this route due to me not being able to find the element that contains the file name when uploaded,
  // therefore, we are relying on the summary modal to confirm the validity of uploaded file.
  test('user can upload 1mb jpg file', async () => {
    await regPageUtils.fillAllRequiredFields();
    await regPage.uploadPicture(filePath.one_mb_jpg_file);
    await regPage.clickSubmitButton();
    await expect(regPage.summarySubmitModal).toBeVisible();
    await expect(regPage.pictureModalRow.locator('td').nth(1)).toHaveText(assertion.one_mb_jpg_file);
  })
  test('user can upload 1mb png file', async () => {
    await regPageUtils.fillAllRequiredFields();
    await regPage.uploadPicture(filePath.one_mb_png_file);
    await regPage.clickSubmitButton();
    await expect(regPage.summarySubmitModal).toBeVisible();
    await expect(regPage.pictureModalRow.locator('td').nth(1)).toHaveText(assertion.one_mb_png_file);
  })
  test('user can upload 10mb jpg file', async () => {
    await regPageUtils.fillAllRequiredFields();
    await regPage.uploadPicture(filePath.ten_mb_jpg_file);
    await regPage.clickSubmitButton();
    await expect(regPage.summarySubmitModal).toBeVisible();
    await expect(regPage.pictureModalRow.locator('td').nth(1)).toHaveText(assertion.ten_mb_jpg_file);
  })
  test('user can upload 10mb png file', async () => {
    await regPageUtils.fillAllRequiredFields();
    await regPage.uploadPicture(filePath.ten_mb_png_file);
    await regPage.clickSubmitButton();
    await expect(regPage.summarySubmitModal).toBeVisible();
    await expect(regPage.pictureModalRow.locator('td').nth(1)).toHaveText(assertion.ten_mb_png_file);
  })
})
