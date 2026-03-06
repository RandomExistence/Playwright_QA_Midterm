import { test, expect } from '@playwright/test'
import { RegPage } from '../../pages/regPage'
import { ValidData, InvalidData, Constant, FilePath, Assertion  } from '../../data/regData';
import { RegPageUtils } from '../../pages/utils/regPageUtils'

const validData = new ValidData();
const invalidData = new InvalidData();
const constant = new Constant();
const filePath = new FilePath('./');
const assertion = new Assertion();

test.describe('subject input allows subjects selection and removal', async () => {
  let regPage: RegPage;
  test.beforeEach(async ({ page }) => {
    regPage = new RegPage(page);
    await regPage.goto();
  });

  test('select one subject', async () => {
    await regPage.selectSubjectPill(constant.ACCOUNTING);
    await expect(regPage.subjectOptionContainer).toContainText(constant.ACCOUNTING);
  })
  test('select all subjects', async () => {
    for (let subject of constant.SUBJECTS_ALL) {
      await regPage.selectSubjectPill(subject);
      await expect(regPage.subjectOptionContainer).toContainText(subject);
    }
  })
  test('remove correct subject', async () => {
    await regPage.selectSubjectPill(constant.HINDI);
    await regPage.selectSubjectPill(constant.COMPUTER_SCIENCE);
    await regPage.selectSubjectPill(constant.COMMERCE);

    await regPage.removeSubjectPill(constant.COMPUTER_SCIENCE);
    await expect(regPage.subjectOptionPill.filter({ hasText: constant.COMPUTER_SCIENCE })).toHaveCount(0); // .subjectOptionPill resolves to multiple element and .not.toContainText breaks due to that
    await expect(regPage.subjectOptionPill).toContainText([constant.HINDI, constant.COMMERCE]);
  })
  test('remove all subjects', async () => {
    for (let subject of constant.SUBJECTS_ALL) {
      await regPage.selectSubjectPill(subject);
      await expect(regPage.subjectOptionContainer).toContainText(subject);
    }
    for (let subject of constant.SUBJECTS_ALL) {
      await regPage.removeSubjectPill(subject);
      await expect(regPage.subjectOptionPill.filter({ hasText: subject })).toHaveCount(0);
    }
  })
})