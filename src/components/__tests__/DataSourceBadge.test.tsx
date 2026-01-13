/**
 * Component tests for DataSourceBadge
 * Target: Full coverage of badge display, popover interaction, and accessibility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataSourceBadge } from '../DataSourceBadge';
import type { LifeExpectancySource } from '../../types';

describe('DataSourceBadge', () => {
  const incomeSource: LifeExpectancySource = {
    type: 'income',
    dataSource: 'Health Inequality Project',
    description: 'US income data (50th percentile)',
    details: {
      country: 'USA',
      incomePercentile: 50,
      gender: 'male',
    },
  };

  const countrySource: LifeExpectancySource = {
    type: 'country',
    dataSource: 'WHO',
    description: 'USA country data',
    details: {
      country: 'USA',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Badge Display', () => {
    it('should render income data badge', () => {
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      expect(screen.getByRole('button', { name: /US Income Data/i })).toBeInTheDocument();
    });

    it('should show percentile in income badge', () => {
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      expect(screen.getByText(/50th %ile/i)).toBeInTheDocument();
    });

    it('should render country data badge', () => {
      render(<DataSourceBadge source={countrySource} lifeExpectancy={79.5} />);

      // Badge has aria-label with full description
      expect(screen.getByRole('button', { name: /USA country data/i })).toBeInTheDocument();
      // But shows "WHO Country Data" as text
      expect(screen.getByText('WHO Country Data')).toBeInTheDocument();
    });

    it('should show data source icon', () => {
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      expect(screen.getByText('📊')).toBeInTheDocument();
    });

    it('should show chevron icon', () => {
      const { container } = render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      const chevron = container.querySelector('.badge-chevron');
      expect(chevron).toBeInTheDocument();
    });
  });

  describe('Popover Interaction', () => {
    it('should not show popover initially', () => {
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should show popover when badge clicked', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      const badge = screen.getByRole('button', { name: /US Income Data/i });
      await user.click(badge);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Data Source Details')).toBeInTheDocument();
    });

    it('should close popover when badge clicked again', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      const badge = screen.getByRole('button');
      await user.click(badge); // Open
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      await user.click(badge); // Close
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('should close popover when close button clicked', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      const badge = screen.getByRole('button', { name: /US Income Data/i });
      await user.click(badge);

      const closeButton = screen.getByRole('button', { name: /Close details/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('should close popover when clicking outside', async () => {
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      const badge = screen.getByRole('button');
      fireEvent.click(badge);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('should close popover on Escape key', async () => {
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      const badge = screen.getByRole('button');
      fireEvent.click(badge);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  describe('Popover Content - Income Data', () => {
    it('should show current life expectancy', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByText(/Current Estimate:/i)).toBeInTheDocument();
      expect(screen.getByText(/84\.5 years/i)).toBeInTheDocument();
    });

    it('should show data source name', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByText(/Health Inequality Project/i)).toBeInTheDocument();
    });

    it('should show user data details', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByText(/Your Data:/i)).toBeInTheDocument();
      expect(screen.getByText(/Income: 50th percentile/i)).toBeInTheDocument();
      expect(screen.getByText(/Gender: male/i)).toBeInTheDocument();
      expect(screen.getByText(/Country: USA/i)).toBeInTheDocument();
    });

    it('should show WHO comparison when provided', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} whoEstimate={81.2} />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByText(/For Comparison:/i)).toBeInTheDocument();
      expect(screen.getByText(/81\.2 years/i)).toBeInTheDocument();
      expect(screen.getByText(/WHO Country Data would estimate/i)).toBeInTheDocument();
    });

    it('should show research citation', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByText(/Chetty et al/i)).toBeInTheDocument();
      expect(screen.getByText(/1\.4 billion tax records/i)).toBeInTheDocument();
    });

    it('should link to research website', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      await user.click(screen.getByRole('button'));

      const link = screen.getByRole('link', { name: /View Research/i });
      expect(link).toHaveAttribute('href', 'https://healthinequality.org');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Popover Content - Country Data', () => {
    it('should show WHO data source', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={countrySource} lifeExpectancy={79.5} />);

      await user.click(screen.getByRole('button'));

      // Check for WHO in popover content (not badge)
      const popover = screen.getByRole('tooltip');
      expect(popover).toHaveTextContent('WHO');
      expect(popover).toHaveTextContent(/World Health Organization/i);
    });

    it('should not show user data details for country source', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={countrySource} lifeExpectancy={79.5} />);

      await user.click(screen.getByRole('button'));

      expect(screen.queryByText(/Your Data:/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Income:/i)).not.toBeInTheDocument();
    });

    it('should not show WHO comparison for country source', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={countrySource} lifeExpectancy={79.5} whoEstimate={79.5} />);

      await user.click(screen.getByRole('button'));

      expect(screen.queryByText(/For Comparison:/i)).not.toBeInTheDocument();
    });

    it('should link to WHO website', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={countrySource} lifeExpectancy={79.5} />);

      await user.click(screen.getByRole('button'));

      const link = screen.getByRole('link', { name: /View WHO Data/i });
      expect(link).toHaveAttribute('href', expect.stringContaining('who.int'));
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  describe('Accessibility (WCAG 2.1 AA)', () => {
    it('should have aria-expanded attribute', () => {
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      const badge = screen.getByRole('button');
      expect(badge).toHaveAttribute('aria-expanded', 'false');
    });

    it('should update aria-expanded when opened', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      const badge = screen.getByRole('button');
      await user.click(badge);

      expect(badge).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have aria-controls attribute', () => {
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      const badge = screen.getByRole('button');
      expect(badge).toHaveAttribute('aria-controls', 'source-details-popover');
    });

    it('should have descriptive aria-label', () => {
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      const badge = screen.getByRole('button', { name: /Data source:.*Click for details/i });
      expect(badge).toBeInTheDocument();
    });

    it('should use role="tooltip" for popover', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should return focus to badge after closing with Escape', async () => {
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      const badge = screen.getByRole('button');
      fireEvent.click(badge);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(badge).toHaveFocus();
      });
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should hide percentile detail in badge text on mobile (CSS)', () => {
      const { container } = render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      const percentileDetail = container.querySelector('.badge-detail');
      expect(percentileDetail).toBeInTheDocument();
      expect(percentileDetail).toHaveTextContent(/50th %ile/);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing WHO estimate gracefully', async () => {
      const user = userEvent.setup();
      render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      await user.click(screen.getByRole('button'));

      // Should not show comparison section
      expect(screen.queryByText(/For Comparison:/i)).not.toBeInTheDocument();
    });

    it('should handle source without details', async () => {
      const minimalSource: LifeExpectancySource = {
        type: 'income',
        dataSource: 'Test Source',
        description: 'Test description',
      };

      const user = userEvent.setup();
      render(<DataSourceBadge source={minimalSource} lifeExpectancy={80} />);

      await user.click(screen.getByRole('button'));

      // Should still render popover
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should handle chevron rotation (CSS)', () => {
      const { container } = render(<DataSourceBadge source={incomeSource} lifeExpectancy={84.5} />);

      const chevron = container.querySelector('.badge-chevron');
      expect(chevron).not.toHaveClass('open');

      const badge = screen.getByRole('button');
      fireEvent.click(badge);

      expect(chevron).toHaveClass('open');
    });
  });
});
