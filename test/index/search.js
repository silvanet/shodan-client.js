/*
  Copyright Jesús Pérez <jesusprubio@member.fsf.org>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

/* eslint-disable no-console */

'use strict';

const assert = require('assert');

const client = require('../..');
const utilsTest = require('../utils');

let shodanKey;
if (process.env.KEY_TEST) {
  shodanKey = process.env.KEY_TEST;
}

describe('search', () => {
  it('should fail if "query" parameter no present', async () =>
    utilsTest.throwsAsync(() => client.search(), /Required parameter: query/));

  it('should fail if "key" parameter no present', async () =>
    utilsTest.throwsAsync(
      () => client.search('asterisk'),
      /You must provide a valid API key/,
    ));

  it('should fail if the HTTP request fails', async function t() {
    utilsTest.insist(this);
    utilsTest.throwsAsync(
      () => client.search('asterisk', 'a'),
      /request.get : 40/,
    );
  });

  it('should have into account the "timeout" option', async function t() {
    utilsTest.insist(this);
    utilsTest.throwsAsync(
      () => client.search('asterisk', 'a', { timeout: 1 }),
      /request.get : Error: ETIMEDOUT/,
    );
  });

  it('should work for a valid query', async function t() {
    if (!shodanKey) {
      this.skip();
    }
    utilsTest.insist(this);

    const res = await client.search('asterisk port:5060', shodanKey);

    assert.deepEqual(Object.keys(res), ['matches', 'total']);
    assert.deepEqual(Object.keys(res.matches[0]), [
      'info',
      '_shodan',
      'product',
      'hash',
      'os',
      'ip',
      'isp',
      'port',
      'hostnames',
      'location',
      'timestamp',
      'domains',
      'org',
      'data',
      'asn',
      'transport',
      'ip_str',
    ]);
    assert.ok(typeof res.total, 'number');
    assert.ok(res.total > 0);
  });
});
