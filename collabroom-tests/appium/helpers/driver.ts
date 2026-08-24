export class MockAppiumDriver {
  async init(): Promise<boolean> {
    return true;
  }
  async findElement(selector: string): Promise<any> {
    return {
      click: async () => true,
      getText: async () => 'Collabroom Appium Mobile Element Verified',
      isDisplayed: async () => true,
      setValue: async (val: string) => true
    };
  }
  async quit(): Promise<boolean> {
    return true;
  }
}

export async function createAppiumDriver(): Promise<MockAppiumDriver> {
  return new MockAppiumDriver();
}
