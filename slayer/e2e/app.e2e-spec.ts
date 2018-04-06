import { SlayerPage } from './app.po';

describe('slayer App', () => {
  let page: SlayerPage;

  beforeEach(() => {
    page = new SlayerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
