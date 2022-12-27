import { IsUserActivatedGuard } from './is-user-activated.guard';

describe('IsUserActivatedGuard', () => {
  it('should be defined', () => {
    expect(new IsUserActivatedGuard()).toBeDefined();
  });
});
