import React from 'react';

function LotusCount ({ lotusCount }) {
  return (
    <div className='lotus-count'>
      <span className='lotus-icon'>🪷</span>
      <span className='lotus-count'>{lotusCount}</span>
    </div>
  )
}

export default LotusCount;