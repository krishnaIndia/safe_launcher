'use strict';

import axios from 'axios';
import should from 'should';

describe('Server status', () => {
  it('Should have started', async () => {
    axios.get('http://localhost:8100/health').should.be.fulfilled();
  })
});
