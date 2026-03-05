import { Page, Locator } from '@playwright/test'

export class RegPage {

  readonly url: string = 'https://demoqa.com/automation-practice-form'
  readonly page: Page;

  readonly firstnameTextInput: Locator;
  readonly lastnameTextInput: Locator;
  readonly emailTextInput: Locator;
  readonly mobileTextInput: Locator;
  readonly birthdateTextInput: Locator;
  readonly subjectOptionInput: Locator;
  readonly currentaddressTextInput: Locator;
  readonly stateDropdownInput: Locator;
  readonly cityDropdownInput: Locator;

  readonly gendermaleRadioButton: Locator;
  readonly genderfemaleRadioButton: Locator;
  readonly genderotherRadioButton: Locator;
  readonly hobbysportCheckbox: Locator;
  readonly hobbyreadingCheckbox: Locator;
  readonly hobbymusicCheckbox: Locator;
  readonly fileUploadInput: Locator;
  readonly calendarDialog: Locator;
  readonly subjectOptionList: Locator;
  readonly stateOptionList: Locator;
  readonly cityOptionList: Locator;

  readonly submitButton: Locator;
  
  readonly subjectOptionContainer: Locator;
  readonly subjectOptionPill: Locator;
  readonly stateDropdownContainer: Locator;
  readonly cityDropdownContainer: Locator;

  readonly summarySubmitModal: Locator;
  readonly studentnameModalRow: Locator;
  readonly studentemailModalRow: Locator;
  readonly genderModalRow: Locator;
  readonly mobileModalRow: Locator;
  readonly dateofbirthModalRow: Locator;
  readonly subjectsModalRow: Locator;
  readonly hobbiesModalRow: Locator;
  readonly pictureModalRow: Locator;
  readonly addressModalRow: Locator;
  readonly stateandcityModalRow: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstnameTextInput = this.page.getByPlaceholder('First Name');
    this.lastnameTextInput = this.page.getByPlaceholder('Last Name');
    this.emailTextInput = this.page.getByPlaceholder('name@example.com');
    this.mobileTextInput = this.page.getByPlaceholder('Mobile Number');
    this.birthdateTextInput = this.page.locator('#dateOfBirthInput');
    this.subjectOptionInput = this.page.locator('#subjectsInput');
    this.currentaddressTextInput = this.page.getByPlaceholder('Current Address');
    this.stateDropdownInput = this.page.locator('#react-select-3-input');
    this.cityDropdownInput = this.page.locator('#react-select-4-input');

    this.calendarDialog = this.page.getByRole('dialog', { name: 'Choose Date' });
    this.gendermaleRadioButton = this.page.getByRole('radio', { name: 'Male', exact:true });
    this.genderfemaleRadioButton = this.page.getByRole('radio', { name: 'Female', exact:true });
    this.genderotherRadioButton = this.page.getByRole('radio', { name: 'Other' });
    this.hobbysportCheckbox = this.page.getByRole('checkbox', { name: 'Sports' });
    this.hobbyreadingCheckbox = this.page.getByRole('checkbox', { name: 'Reading' });
    this.hobbymusicCheckbox = this.page.getByRole('checkbox', { name: 'Music' });
    this.fileUploadInput = this.page.locator('#uploadPicture');
    this.subjectOptionList = this.page.locator('#react-select-2-listbox');
    this.stateOptionList = this.page.locator('#react-select-3-listbox');
    this.cityOptionList = this.page.locator('#react-select-4-listbox')

    this.submitButton = this.page.getByRole('button', { name: 'Submit' })

    this.subjectOptionContainer = this.page.locator('#subjectsContainer')
    this.subjectOptionPill = this.page.locator('#subjectsContainer .subjects-auto-complete__multi-value__label')
    this.stateDropdownContainer = this.page.locator('#state')
    this.cityDropdownContainer = this.page.locator('#city')

    this.summarySubmitModal = this.page.getByRole('dialog', { name: 'Thanks for submitting the form' })
    this.studentnameModalRow = this.page.locator('tr', { hasText: 'Student Name' });
    this.studentemailModalRow = this.page.locator('tr', { hasText: 'Student Email'});
    this.genderModalRow = this.page.locator('tr', { hasText: 'Gender' });
    this.mobileModalRow = this.page.locator('tr', { hasText: 'Mobile'});
    this.dateofbirthModalRow = this.page.locator('tr', { hasText: 'Date of Birth'});
    this.subjectsModalRow = this.page.locator('tr', { hasText: 'Subjects'});
    this.hobbiesModalRow = this.page.locator('tr', { hasText: 'Hobbies'});
    this.pictureModalRow = this.page.locator('tr', { hasText: 'Picture'});
    this.addressModalRow = this.page.locator('tr', { hasText: 'Address'});
    this.stateandcityModalRow = this.page.locator('tr', { hasText: 'State and City'});
  }

  async goto() {
    await this.page.goto(this.url)
  }
  
  async fillFirstname(firstname: string) {
    await this.firstnameTextInput.fill(firstname)
  }
  
  async fillLastname(lastname: string) {
    await this.lastnameTextInput.fill(lastname)
  }
  
  async fillEmail(email: string) {
    await this.emailTextInput.fill(email)
  }
  
  async fillMobile(mobile: string) {
    await this.mobileTextInput.fill(mobile)
  }
  
  async fillBirthdate(date: string) {
    await this.birthdateTextInput.fill(date)
    await this.page.keyboard.press('Enter'); // to close date modal
  }
  
  async fillCurrentaddress(currentaddress: string) {
    await this.currentaddressTextInput.fill(currentaddress)
  }
  
  async selectGender(gender: string) {
    await this.page.getByRole('radio', { name: gender, exact:true }).click(); // without exact, playwright sees 'Male' and 'Female' at the same time
  }
  
  async selectHobby(hobby: string) {
    await this.page.getByRole('checkbox', { name: hobby }).click();
  }

  async selectState(state: string) {
    await this.stateDropdownInput.fill(state);
    await this.stateOptionList.getByRole('option', { name: state }).click();
  }

  async selectCity(city: string) {
    await this.cityDropdownInput.fill(city);
    await this.cityOptionList.getByRole('option', { name: city }).click();
  }
  
  async selectBirthdate(day:string, month:string, year:string) {
    await this.birthdateTextInput.click(); // to open up dialog
    await this.calendarDialog.locator('.react-datepicker__year-select').selectOption(year);
    await this.calendarDialog.locator('.react-datepicker__month-select').selectOption(month);
    await this.page.getByRole('gridcell', {
      name: regexDateGenerator(day, month, year)
    }).click();
  }
  
  async selectSubjectPill(subject: string) {
    await this.subjectOptionInput.fill(subject);
    await this.subjectOptionList.getByRole('option', { name: subject }).click();
  }

  async removeSubjectPill(subject: string) {
    await this.page.getByRole('button', { name: `Remove ${subject}` }).click();
  }

  async uploadPicture(filePath: string) {
    await this.fileUploadInput.setInputFiles(filePath);
  }

  async clickSubmitButton() {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
  }

  // ------------------------------------ UTILITIES ------------------------------------ //
  async setTime(year:number, month:number, day:number, hour:number=0, minute:number=0) {
    await this.page.clock.setFixedTime(new Date(year, month, day, hour, minute));
  }
}

function regexDateGenerator(day:string, month:string, year:string) {
  var suffix = 'th'
  if (day.length == 2) {
    if (day.charAt(0) == '1') {
      return new RegExp(`${month} ${day}${suffix}, ${year}`)
    }
    else {
      if (day.charAt(1) === '1') { suffix = 'st' } else 
      if (day.charAt(1) === '2') { suffix = 'nd' } else
      if (day.charAt(1) === '3') { suffix = 'rd' }
    }
  }
  else if (day.length == 1) {
    if (day.charAt(0) === '1') { suffix = 'st' } else 
    if (day.charAt(0) === '2') { suffix = 'nd' } else
    if (day.charAt(0) === '3') { suffix = 'rd' }
  }
  return new RegExp(`${month} ${day}${suffix}, ${year}`)
}