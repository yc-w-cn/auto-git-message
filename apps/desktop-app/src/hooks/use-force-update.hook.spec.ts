import useForceUpdate from './use-force-update.hook';
import { renderHook, act } from '@testing-library/react';

describe('useForceUpdate', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useForceUpdate());

    expect(result.current.forceUpdated).toBe(0);
    expect(typeof result.current.lastUpdated).toBe('number');
  });

  it('should update forceUpdated and lastUpdated when forceUpdate is called', () => {
    const { result } = renderHook(() => useForceUpdate());
    const initialLastUpdated = result.current.lastUpdated;

    act(() => {
      result.current.forceUpdate();
    });

    expect(result.current.forceUpdated).toBe(1);
    expect(result.current.lastUpdated).not.toBe(initialLastUpdated);
  });

  it('should increment forceUpdated each time forceUpdate is called', () => {
    const { result } = renderHook(() => useForceUpdate());

    act(() => {
      result.current.forceUpdate();
    });

    expect(result.current.forceUpdated).toBe(1);

    act(() => {
      result.current.forceUpdate();
    });

    expect(result.current.forceUpdated).toBe(2);
  });

  it('should update lastUpdated to a newer timestamp when forceUpdate is called', () => {
    const { result } = renderHook(() => useForceUpdate());
    const initialLastUpdated = result.current.lastUpdated;

    act(() => {
      result.current.forceUpdate();
    });

    expect(result.current.lastUpdated).toBeGreaterThan(initialLastUpdated);
  });
});