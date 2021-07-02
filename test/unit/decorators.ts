import { applyCaseOptions, preserveSpecificKeys } from '../../src/decorators';
import { noCase } from 'no-case';

test('it should change noCase() behavior', () => {
  expect(noCase('user_profile[screen_name]')).toBe('user profile screen name');
  expect(
    applyCaseOptions(noCase, { stripRegexp: /[^A-Z0-9[\]]+/gi })(
      'user_profile[screen_name]'
    )
  ).toBe('user profile[screen name]');
});

test('it should preserve specific keys', () => {
  expect(noCase('user_profile')).toBe('user profile');
  expect(preserveSpecificKeys(noCase, ['user_profile'])('user_profile')).toBe(
    'user_profile'
  );
  expect(
    preserveSpecificKeys(
      noCase,
      (input) => input === 'user_profile'
    )('user_profile')
  ).toBe('user_profile');
});
