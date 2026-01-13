/**
 * Component tests for IncomeInput
 * Target: Full coverage of UI interactions, accessibility, and live preview
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IncomeInput } from '../IncomeInput';

describe('IncomeInput', () => {
  const defaultProps = {
    value: undefined,
    onChange: vi.fn(),
    onSkip: vi.fn(),
    currentLifeExpectancy: 79.5,
    gender: 'male' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render income input component', () => {
      render(<IncomeInput {...defaultProps} />);

      expect(screen.getByLabelText(/Annual Household Income/i)).toBeInTheDocument();
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('should show "Optional" badge', () => {
      render(<IncomeInput {...defaultProps} />);

      expect(screen.getByText(/Optional/i)).toBeInTheDocument();
    });

    it('should show Skip button', () => {
      render(<IncomeInput {...defaultProps} />);

      expect(screen.getByRole('button', { name: /Skip/i })).toBeInTheDocument();
    });

    it('should show description about income impact', () => {
      render(<IncomeInput {...defaultProps} />);

      expect(
        screen.getByText(/Research shows income affects US life expectancy by up to 14 years/i)
      ).toBeInTheDocument();
    });

    it('should display default income value ($57k)', () => {
      render(<IncomeInput {...defaultProps} />);

      expect(screen.getByText(/\$57k\/year/i)).toBeInTheDocument();
    });

    it('should display percentile for default income', () => {
      render(<IncomeInput {...defaultProps} />);

      // Default $57k should be around 46th percentile for males
      expect(screen.getByText(/46th percentile/i)).toBeInTheDocument();
    });
  });

  describe('Slider Interaction', () => {
    it('should update income display when slider changes', async () => {
      const user = userEvent.setup();
      render(<IncomeInput {...defaultProps} />);

      const slider = screen.getByRole('slider');

      // Change slider value
      fireEvent.change(slider, { target: { value: '100000' } });

      // Should show new formatted income
      expect(screen.getByText(/\$100k\/year/i)).toBeInTheDocument();
    });

    it('should call onChange with calculated percentile', () => {
      const onChange = vi.fn();
      render(<IncomeInput {...defaultProps} onChange={onChange} />);

      const slider = screen.getByRole('slider');

      // Change to $100k (should be around 70th percentile for males)
      fireEvent.change(slider, { target: { value: '100000' } });

      expect(onChange).toHaveBeenCalled();
      const percentile = onChange.mock.calls[0][0];
      expect(percentile).toBeGreaterThan(50);
      expect(percentile).toBeLessThan(90);
    });

    it('should have correct slider configuration', () => {
      render(<IncomeInput {...defaultProps} />);

      const slider = screen.getByRole('slider') as HTMLInputElement;

      expect(slider.min).toBe('0');
      expect(slider.max).toBe('2000000');
      expect(slider.step).toBe('5000');
    });

    it('should update percentile display when slider changes', () => {
      render(<IncomeInput {...defaultProps} />);

      const slider = screen.getByRole('slider');

      // Change to low income
      fireEvent.change(slider, { target: { value: '20000' } });

      // Should show lower percentile
      const percentileText = screen.getByText(/\d+th percentile/i).textContent;
      const percentile = parseInt(percentileText!.match(/\d+/)![0]);
      expect(percentile).toBeLessThan(40);
    });
  });

  describe('Live Preview', () => {
    it('should show live preview with new life expectancy', () => {
      render(<IncomeInput {...defaultProps} />);

      // Should show "More accurate estimate"
      expect(screen.getByText(/More accurate estimate:/i)).toBeInTheDocument();

      // Should show a life expectancy value in the preview
      const preview = screen.getByRole('status');
      expect(preview).toHaveTextContent(/81\.\d+ years/);
    });

    it('should show positive difference for high income', () => {
      render(<IncomeInput {...defaultProps} currentLifeExpectancy={79} />);

      const slider = screen.getByRole('slider');

      // Set to high income (90th percentile)
      fireEvent.change(slider, { target: { value: '200000' } });

      // Should show positive difference message
      expect(screen.getByText(/compared to country average/i)).toBeInTheDocument();
    });

    it('should show neutral message for lower life expectancy', () => {
      render(<IncomeInput {...defaultProps} currentLifeExpectancy={85} />);

      const slider = screen.getByRole('slider');

      // Set to low income
      fireEvent.change(slider, { target: { value: '10000' } });

      // Should show neutral message (not negative)
      expect(screen.getByText(/Based on US income research/i)).toBeInTheDocument();
    });

    it('should show disclaimer about population averages', () => {
      render(<IncomeInput {...defaultProps} />);

      expect(
        screen.getByText(/Life expectancy estimates are population averages/i)
      ).toBeInTheDocument();
    });

    it('should update live preview dynamically', () => {
      const { rerender } = render(<IncomeInput {...defaultProps} />);

      const slider = screen.getByRole('slider');

      // Change income
      fireEvent.change(slider, { target: { value: '150000' } });

      // Get first life expectancy
      const firstLE = screen.getByText(/More accurate estimate:/i)
        .nextElementSibling?.textContent;

      // Change income again
      fireEvent.change(slider, { target: { value: '50000' } });

      // Get second life expectancy
      const secondLE = screen.getByText(/More accurate estimate:/i)
        .nextElementSibling?.textContent;

      // Should be different
      expect(firstLE).not.toBe(secondLE);
    });
  });

  describe('Skip Functionality', () => {
    it('should call onSkip when Skip button clicked', async () => {
      const user = userEvent.setup();
      const onSkip = vi.fn();
      render(<IncomeInput {...defaultProps} onSkip={onSkip} />);

      const skipButton = screen.getByRole('button', { name: /Skip/i });
      await user.click(skipButton);

      expect(onSkip).toHaveBeenCalledTimes(1);
    });

    it('should have accessible Skip button', () => {
      render(<IncomeInput {...defaultProps} />);

      const skipButton = screen.getByRole('button', { name: /Skip income question/i });
      expect(skipButton).toBeInTheDocument();
    });
  });

  describe('Accessibility (WCAG 2.1 AA)', () => {
    it('should have proper label association', () => {
      render(<IncomeInput {...defaultProps} />);

      const slider = screen.getByLabelText(/Annual Household Income/i);
      expect(slider).toBeInTheDocument();
      expect(slider.tagName).toBe('INPUT');
    });

    it('should have ARIA attributes on slider', () => {
      render(<IncomeInput {...defaultProps} />);

      const slider = screen.getByRole('slider') as HTMLInputElement;

      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '2000000');
      expect(slider).toHaveAttribute('aria-valuenow');
      expect(slider).toHaveAttribute('aria-valuetext');
    });

    it('should have descriptive aria-valuetext', () => {
      render(<IncomeInput {...defaultProps} />);

      const slider = screen.getByRole('slider') as HTMLInputElement;
      const valueText = slider.getAttribute('aria-valuetext');

      expect(valueText).toContain('per year');
      expect(valueText).toContain('percentile');
    });

    it('should have aria-live region for live preview', () => {
      render(<IncomeInput {...defaultProps} />);

      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<IncomeInput {...defaultProps} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.focus();

      expect(slider).toHaveFocus();

      // Slider should respond to keyboard (arrow keys handled by browser)
      // Just verify it's focusable and can be controlled via keyboard
      expect(slider.tabIndex).toBeGreaterThanOrEqual(0);
    });

    it('should have touch-action manipulation for mobile', () => {
      render(<IncomeInput {...defaultProps} />);

      const slider = screen.getByRole('slider') as HTMLInputElement;

      // Check for touch-action style (set via style prop)
      expect(slider.style.touchAction).toBe('manipulation');
    });
  });

  describe('Income Formatting', () => {
    it('should format low incomes correctly', () => {
      render(<IncomeInput {...defaultProps} />);

      const slider = screen.getByRole('slider');

      fireEvent.change(slider, { target: { value: '500' } });
      expect(screen.getByText(/\$500\/year/i)).toBeInTheDocument();
    });

    it('should format thousands with k suffix', () => {
      render(<IncomeInput {...defaultProps} />);

      const slider = screen.getByRole('slider');

      fireEvent.change(slider, { target: { value: '75000' } });
      expect(screen.getByText(/\$75k\/year/i)).toBeInTheDocument();
    });

    it('should format millions with M suffix', () => {
      render(<IncomeInput {...defaultProps} />);

      const slider = screen.getByRole('slider');

      fireEvent.change(slider, { target: { value: '1500000' } });
      expect(screen.getByText(/\$1\.5M\/year/i)).toBeInTheDocument();
    });
  });

  describe('Gender Handling', () => {
    it('should calculate percentile correctly for female', () => {
      const onChange = vi.fn();
      render(<IncomeInput {...defaultProps} gender="female" onChange={onChange} />);

      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '100000' } });

      expect(onChange).toHaveBeenCalled();
      // Female income scale is different from male
      const percentile = onChange.mock.calls[0][0];
      expect(percentile).toBeGreaterThan(1);
      expect(percentile).toBeLessThan(100);
    });

    it('should calculate percentile correctly for other gender', () => {
      const onChange = vi.fn();
      render(<IncomeInput {...defaultProps} gender="other" onChange={onChange} />);

      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '60000' } });

      expect(onChange).toHaveBeenCalled();
      const percentile = onChange.mock.calls[0][0];
      expect(percentile).toBeGreaterThan(1);
      expect(percentile).toBeLessThan(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null currentLifeExpectancy gracefully', () => {
      render(<IncomeInput {...defaultProps} currentLifeExpectancy={null as any} />);

      // Component should still render
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('should handle null gender gracefully', () => {
      render(<IncomeInput {...defaultProps} gender={null as any} />);

      // Component should still render slider
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('should handle existing value prop', () => {
      render(<IncomeInput {...defaultProps} value={75} />);

      // Should initialize with income for 75th percentile
      const display = screen.getByText(/\/year/i);
      expect(display).toBeInTheDocument();

      // Should show 75th percentile
      expect(screen.getByText(/75th percentile/i)).toBeInTheDocument();
    });

    it('should reset to default when value is undefined', () => {
      const { rerender } = render(<IncomeInput {...defaultProps} value={90} />);

      // Should show 90th percentile
      expect(screen.getByText(/90th percentile/i)).toBeInTheDocument();

      // Clear value
      rerender(<IncomeInput {...defaultProps} value={undefined} />);

      // Should reset to default (~50th percentile, $57k)
      expect(screen.getByText(/\$57k\/year/i)).toBeInTheDocument();
    });
  });

  describe('Income Markers', () => {
    it('should display income range markers', () => {
      render(<IncomeInput {...defaultProps} />);

      expect(screen.getByText('$0')).toBeInTheDocument();
      expect(screen.getByText('$500k')).toBeInTheDocument();
      expect(screen.getByText('$1M')).toBeInTheDocument();
      expect(screen.getByText('$1.5M')).toBeInTheDocument();
      expect(screen.getByText('$2M')).toBeInTheDocument();
    });
  });
});
