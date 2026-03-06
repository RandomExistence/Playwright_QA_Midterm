import { Locator } from '@playwright/test'
import { RegPage } from '../regPage'
import { ValidData, InvalidData, Constant, FilePath, Assertion  } from '../../data/regData';

const validData = new ValidData();
const invalidData = new InvalidData();
const constant = new Constant();
const filePath = new FilePath('./');
const assertion = new Assertion();

export class RegPageUtils {
  
  readonly regPage;

  constructor(regPage: RegPage) {
    this.regPage = regPage;
  }

  async fillAllRequiredFields() {
    await this.regPage.fillFirstname(validData.firstname_default);
    await this.regPage.fillLastname(validData.lastname_default);
    await this.regPage.selectGender(constant.MALE);
    await this.regPage.fillMobile(validData.mobile_default);
  }
}