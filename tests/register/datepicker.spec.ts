import { test, expect } from '@playwright/test'
import { RegPage } from '../../pages/regPage'
import { ValidData, InvalidData, Constant, FilePath, Assertion  } from '../../data/regData';
import { RegPageUtils } from '../../pages/utils/regPageUtils'

const validData = new ValidData();
const invalidData = new InvalidData();
const constant = new Constant();
const filePath = new FilePath('./');
const assertion = new Assertion();

test.describe('birthday is selectable via datepicker dialog', async () => {
  let regPage: RegPage;
  test.beforeEach(async ({ page }) => {
    regPage = new RegPage(page);
    await regPage.goto();
  });

  test('select the first day on the datepicker', async () => {
    await regPage.selectBirthdate('1','January','1900');
    await expect(regPage.birthdateTextInput).toHaveValue(/01 Jan 1900/);
  })
  
  test('select the last day on the datepicker', async () => {
    await regPage.selectBirthdate('31','December','2100');
    await expect(regPage.birthdateTextInput).toHaveValue(/31 Dec 2100/);
  })

  test('select day from 1 to 31', async () => {
    for (let day of constant.DAYS_1_TO_31) {
      await regPage.selectBirthdate(`${day}`,'March','2000');
      await expect(regPage.birthdateTextInput).toHaveValue(new RegExp(`${day} Mar 2000`));
    }
  })
  
  test('select month from January to December', async () => {
    for (let month of constant.MONTHS_JAN_TO_DEC) {
      await regPage.selectBirthdate('1',month,'2000');
      await expect(regPage.birthdateTextInput).toHaveValue(new RegExp(`1 ${month.substring(0,3)} 2000`));
    }
  })

  test('select year from 1900 to 2100 that is a multiple of ten', async () => {
    for (let year of constant.YEARS_1900_TO_2100_MULTIPLE_OF_TEN) {
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

