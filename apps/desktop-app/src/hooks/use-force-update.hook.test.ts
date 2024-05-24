import { act } from '@testing-library/react';
import useForceUpdate from './use-force-update.hook';

describe('useForceUpdate', () => {
  it('should force component update', () => {
    const { forceUpdated, forceUpdate } = useForceUpdate();

    // Initial render
    expect(forceUpdated).toBe(0);

    // Trigger an update
    act(() => {
      forceUpdate();
    });

    // Check if the counter has incremented
    expect(forceUpdated).toBe(1);
  });
});
