'use strict';

try {
  makeChart();
} catch (e) {
  if (e.message !== 'chart error') throw e;
}
