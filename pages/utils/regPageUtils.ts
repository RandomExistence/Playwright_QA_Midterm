import { Locator } from '@playwright/test'
import { RegPage } from '../regPage'
import { ValidData, InvalidData, Constant, FilePath, Assertion  } from '../../data/regData';

export class RegPageUtils {
  
  readonly regPage;
  readonly validData;
  readonly invalidData;
  readonly constant;
  readonly filePath;
  readonly assertion;

  constructor(
    regPage: RegPage,
    validData: ValidData,
    invalidData: InvalidData,
    constant: Constant,
    filePath: FilePath,
    assertioin: Assertion
  ) {
    this.regPage = regPage;
    this.validData = validData;
    this.invalidData = invalidData;
    this.constant = constant;
    this.filePath = filePath;
    this.assertion = assertioin
  }

  async fillAllRequiredFields() {
    await this.regPage.fillFirstname(this.validData.firstname_default);
    await this.regPage.fillLastname(this.validData.lastname_default);
    await this.regPage.selectGender(this.constant.MALE);
    await this.regPage.fillMobile(this.validData.mobile_default);
  }



}