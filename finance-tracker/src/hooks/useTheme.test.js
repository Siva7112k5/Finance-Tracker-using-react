import { renderHook, act } from '@testing-library/react';
import useTheme from './useTheme';
import { THEMES } from '../utils/constants';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key]),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    clear: jest.fn(() => { store = {}; })
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn(() => ({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }))
});

describe('useTheme', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
    document.documentElement.classList.remove('dark-theme', 'light-theme');
  });

  test('initializes with light theme by default', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe(THEMES.LIGHT);
    expect(result.current.effectiveTheme).toBe(THEMES.LIGHT);
    expect(result.current.isDarkMode).toBe(false);
    expect(result.current.isLightMode).toBe(true);
  });

  test('loads theme from localStorage', () => {
    mockLocalStorage.setItem('finance_theme', THEMES.DARK);
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe(THEMES.DARK);
    expect(result.current.effectiveTheme).toBe(THEMES.DARK);
  });

  test('toggles theme correctly', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe(THEMES.LIGHT);
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe(THEMES.DARK);
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe(THEMES.LIGHT);
  });

  test('sets specific theme mode', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme(THEMES.DARK);
    });
    
    expect(result.current.theme).toBe(THEMES.DARK);
    
    act(() => {
      result.current.setTheme(THEMES.SYSTEM);
    });
    
    expect(result.current.theme).toBe(THEMES.SYSTEM);
  });

  test('applies theme to document', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(document.documentElement.classList.contains('light-theme')).toBe(true);
    expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
    
    act(() => {
      result.current.setTheme(THEMES.DARK);
    });
    
    expect(document.documentElement.classList.contains('light-theme')).toBe(false);
    expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
  });

  test('saves theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme(THEMES.DARK);
    });
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('finance_theme', THEMES.DARK);
  });

  test('updates custom colors', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.updateCustomColors({ primary: '#ff0000' });
    });
    
    expect(result.current.colors.primary).toBe('#ff0000');
    expect(result.current.hasCustomColors).toBe(true);
  });

  test('resets custom colors', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.updateCustomColors({ primary: '#ff0000' });
    });
    
    expect(result.current.hasCustomColors).toBe(true);
    
    act(() => {
      result.current.resetCustomColors();
    });
    
    expect(result.current.hasCustomColors).toBe(false);
    expect(result.current.colors.primary).toBeDefined();
  });

  test('generates theme CSS', () => {
    const { result } = renderHook(() => useTheme());
    
    const css = result.current.getThemeCSS();
    expect(css).toContain('--theme-background:');
    expect(css).toContain('--theme-text:');
  });

  test('calculates contrast color correctly', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.getContrastColor('#ffffff')).toBe('#000000');
    expect(result.current.getContrastColor('#000000')).toBe('#ffffff');
    expect(result.current.getContrastColor('#667eea')).toBe('#ffffff');
  });

  test('handles system theme preference', () => {
    // Mock system dark mode
    window.matchMedia.mockImplementation(() => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }));

    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme(THEMES.SYSTEM);
    });
    
    expect(result.current.systemTheme).toBe(THEMES.DARK);
    expect(result.current.effectiveTheme).toBe(THEMES.DARK);
  });

  test('responds to system theme changes', () => {
    let mediaListener;
    window.matchMedia.mockImplementation(() => ({
      matches: false,
      addEventListener: (event, listener) => { mediaListener = listener; },
      removeEventListener: jest.fn()
    }));

    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme(THEMES.SYSTEM);
    });
    
    expect(result.current.systemTheme).toBe(THEMES.LIGHT);
    
    // Simulate system theme change
    act(() => {
      mediaListener({ matches: true });
    });
    
    expect(result.current.systemTheme).toBe(THEMES.DARK);
  });

  test('theme transition triggers correctly', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.transition).toBe(true);
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(result.current.transition).toBe(false);
    
    jest.useRealTimers();
  });

  test('handles localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementationOnce(() => {
      throw new Error('Storage error');
    });
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe(THEMES.LIGHT);
  });

  test('dispatches theme change event', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
    
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme(THEMES.DARK);
    });
    
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'themechange',
        detail: expect.objectContaining({
          theme: THEMES.DARK
        })
      })
    );
  });

  test('provides correct color values for each theme', () => {
    const { result } = renderHook(() => useTheme());
    
    // Light theme colors
    expect(result.current.colors.background).toBe('#ffffff');
    expect(result.current.colors.text).toBe('#212529');
    
    act(() => {
      result.current.setTheme(THEMES.DARK);
    });
    
    // Dark theme colors
    expect(result.current.colors.background).toBe('#1a1a1a');
    expect(result.current.colors.text).toBe('#ffffff');
  });

  test('isDarkMode and isLightMode reflect effective theme', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.isLightMode).toBe(true);
    expect(result.current.isDarkMode).toBe(false);
    
    act(() => {
      result.current.setTheme(THEMES.DARK);
    });
    
    expect(result.current.isLightMode).toBe(false);
    expect(result.current.isDarkMode).toBe(true);
  });

  test('isSystemTheme indicates system theme usage', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.isSystemTheme).toBe(false);
    
    act(() => {
      result.current.setTheme(THEMES.SYSTEM);
    });
    
    expect(result.current.isSystemTheme).toBe(true);
  });
});
