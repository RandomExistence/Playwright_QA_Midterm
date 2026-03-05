export class ValidData {

  readonly firstname_default = 'John';
  readonly lastname_default = 'Doe';
  readonly email_default = 'someone@gmail.com';
  readonly mobile_default = '0840902537';
  readonly birthdate_default = '24 Mar 2004';
  readonly currentaddress_default = '432 Channa Road, Bangkok';

  readonly firstname_without_space = 'Jeniffer';
  readonly firstname_with_space = "Pauli 'O";
  readonly lastname_without_space = 'Crackily';
  readonly lastname_with_space = 'Siri Chaiya';
  readonly email_simple = 'user02@gmail.com';
  readonly email_complex = '_user.student01@.a.123.baakaa.reddd';
  readonly mobile_conventional = '0869387912';
  readonly mobile_unconventional = '0221220505';
  readonly birthdate_Jan_1_1900 = '01 Jan 1900';
  readonly birthdate_Dec_31_2100 = '31 Dec 2100';
  readonly currentaddress_without_newline = '215/25 Soi Taweewatana Sathupradit Road Chongnonsi';
  readonly currentaddress_with_newline =
  `
    Address 1:
    Building Number: F-73
    Street Name: Vasant Kunj
    Street Address: DLF Promenade Mall, Nelson Mandela Marg
    State: Delhi
    City: New Delhi
    Post Code: 110070
  `
}

export class InvalidData {
  readonly empty = '';
  readonly gibberish = '8u9int4yq';
  readonly email_no_username = '@mail.com';
  readonly email_no_at = 'user02gmail.com';
  readonly email_no_mail_server = 'user02@.dwcom';
  readonly email_no_domain = 'user@gmail';
  readonly email_domain_too_short = 'user@gmail.a';
  readonly email_domain_has_nonalphabet = 'user@gmail.co2'
  readonly email_domain_too_long = 'user@gmail.comcomc';
  readonly mobile_has_character = '012345_789'
  readonly mobile_has_less_than_10_digits = '676767'
}

// ------------------------------------- CONSTANTS ------------------------------------- //

export class Constant {
  // gender
  readonly MALE = 'Male';
  readonly FEMALE = 'Female';
  readonly OTHER = 'Other';

  // hobby
  readonly SPORTS = 'Sports';
  readonly READING = 'Reading';
  readonly MUSIC = 'Music'

  // subjects
  readonly ACCOUNTING = 'Accounting';
  readonly ARTS = 'Arts';
  readonly BIOLOGY = 'Biology';
  readonly CHEMISTRY = 'Chemistry';
  readonly COMPUTER_SCIENCE = 'Computer Science';
  readonly COMMERCE = 'Commerce';
  readonly CIVICS = 'Civics';
  readonly ENGLISH = 'English';
  readonly ECONOMICS = 'Economics';
  readonly HINDI = 'Hindi';
  readonly HISTORY = 'History';
  readonly MATHS = 'Maths';
  readonly PHYSICS = 'Physics';
  readonly SOCIAL_STUDIES = 'Social Studies';
  readonly SUBJECTS_ALL = [
    'Accounting','Arts','Biology','Chemistry','Computer Science','Commerce','Civics','English','Economics','Hindi','History','Maths','Physics','Social Studies'
  ]

  // state
  readonly NCR = 'NCR';
  readonly UTTAR_PRADESH = 'Uttar Pradesh';
  readonly HARYANA = 'Haryana';
  readonly RAJASTHAN = 'Rajasthan';

  // city
    // NCR
      readonly DELHI = 'Delhi';
      readonly GURGAON = 'Gurgaon';
      readonly NOIDA = 'Noida';
    // Uttar Pradesh
      readonly AGRA = 'Agra';
      readonly LUCKNOW = 'Lucknow';
      readonly MERRUT = 'Merrut';
    // Haryana
      readonly KARNAL = 'Karnal';
      readonly PANIPAT = 'Panipat';
    // Rajasthan
      readonly JAIPUR = 'Jaipur';
      readonly JAISELMER = 'Jaiselmer';
  
  readonly DAYS_1_TO_31 = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
  readonly MONTHS_JAN_TO_DEC = ['January','February','March','April','May','June','July','August','September','October','November','December']
  readonly YEARS_1900_TO_2100 = [
    '1900','1901','1902','1903','1904','1905','1906','1907','1908','1909','1910','1911','1912','1913','1914','1915','1916','1917','1918','1919',
    '1920','1921','1922','1923','1924','1925','1926','1927','1928','1929','1930','1931','1932','1933','1934','1935','1936','1937','1938','1939',
    '1940','1941','1942','1943','1944','1945','1946','1947','1948','1949','1950','1951','1952','1953','1954','1955','1956','1957','1958','1959',
    '1960','1961','1962','1963','1964','1965','1966','1967','1968','1969','1970','1971','1972','1973','1974','1975','1976','1977','1978','1979',
    '1980','1981','1982','1983','1984','1985','1986','1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999',
    '2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019',
    '2020','2021','2022','2023','2024','2025','2026','2027','2028','2029','2030','2031','2032','2033','2034','2035','2036','2037','2038','2039',
    '2040','2041','2042','2043','2044','2045','2046','2047','2048','2049','2050','2051','2052','2053','2054','2055','2056','2057','2058','2059',
    '2060','2061','2062','2063','2064','2065','2066','2067','2068','2069','2070','2071','2072','2073','2074','2075','2076','2077','2078','2079',
    '2080','2081','2082','2083','2084','2085','2086','2087','2088','2089','2090','2091','2092','2093','2094','2095','2096','2097','2098','2099','2100'
  ]
  readonly MONTH_JAN = 'January'
  readonly MONTH_FEB = 'February'
  readonly MONTH_MAR = 'March'
  readonly MONTH_APR = 'April'
  readonly MONTH_MAY = 'May'
  readonly MONTH_JUN = 'June'
  readonly MONTH_JUL = 'July'
  readonly MONTH_AUG = 'August'
  readonly MONTH_SEP = 'September'
  readonly MONTH_OCT = 'October'
  readonly MONTH_NOV = 'November'
  readonly MONTH_DEC = 'December'
}

export class FilePath {
  readonly one_mb_png_file;
  readonly ten_mb_png_file;
  readonly one_mb_jpg_file;
  readonly ten_mb_jpg_file;

  constructor(relativePath: string) {
    this.one_mb_png_file = `${relativePath}data/files/1mb.png`
    this.ten_mb_png_file = `${relativePath}data/files/10mb.png`
    this.one_mb_jpg_file = `${relativePath}data/files/1mb.jpg`
    this.ten_mb_jpg_file = `${relativePath}data/files/10mb.jpg`
  }
}

export class Assertion {
  readonly color_red_error = 'rgb(220, 53, 69)'
  readonly css_border_color = 'border-color'
  readonly css_border_bottom_color = 'border-bottom-color'
  readonly css_border_left_color = 'border-left-color'
  readonly css_border_right_color = 'border-right-color'
  readonly css_border_top_color = 'border-top-color'

  readonly one_mb_png_file = '1mb.png'
  readonly ten_mb_png_file = '10mb.png'
  readonly one_mb_jpg_file = '1mb.jpg'
  readonly ten_mb_jpg_file = '10mb.jpg'
}