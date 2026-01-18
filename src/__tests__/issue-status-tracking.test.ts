/**
 * Issue Status Tracking Screen Tests
 *
 * Comprehensive tests for the issue status tracking functionality including:
 * - IssueStatusScreen component
 * - Issue summary display
 * - Status timeline with animations
 * - Resolution details
 * - Contact support option
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { beforeEach, describe, expect, test } from '@jest/globals';

// ============================================================================
// File Structure Tests
// ============================================================================

describe('Issue Status Tracking - File Structure', () => {
  const srcPath = path.join(process.cwd(), 'src');

  test('Issue status tracking file exists', () => {
    const screenPath = path.join(srcPath, 'app/support/issue/status/[issueId].tsx');
    expect(fs.existsSync(screenPath)).toBe(true);
  });

  test('Status directory exists', () => {
    const dirPath = path.join(srcPath, 'app/support/issue/status');
    expect(fs.existsSync(dirPath)).toBe(true);
  });
});

// ============================================================================
// Issue Status Screen Tests
// ============================================================================

describe('Issue Status Screen', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/status/[issueId].tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  describe('Exports', () => {
    test('exports default IssueStatusScreen', () => {
      expect(content).toMatch(/export\s+default\s+function\s+IssueStatusScreen/);
    });

    test('exports STATUS_CONFIG constant', () => {
      expect(content).toMatch(/export\s+\{[\s\S]*STATUS_CONFIG/);
    });

    test('exports STATUS_ORDER constant', () => {
      expect(content).toMatch(/export\s+\{[\s\S]*STATUS_ORDER/);
    });

    test('exports CATEGORY_TITLES constant', () => {
      expect(content).toMatch(/export\s+\{[\s\S]*CATEGORY_TITLES/);
    });

    test('exports formatDate helper', () => {
      expect(content).toMatch(/export\s+\{[\s\S]*formatDate/);
    });

    test('exports getStatusIndex helper', () => {
      expect(content).toMatch(/export\s+\{[\s\S]*getStatusIndex/);
    });
  });

  describe('Constants', () => {
    describe('CATEGORY_TITLES', () => {
      test('has title for missing_items', () => {
        expect(content).toMatch(/missing_items:\s*['"]Missing Items['"]/);
      });

      test('has title for wrong_items', () => {
        expect(content).toMatch(/wrong_items:\s*['"]Wrong Items['"]/);
      });

      test('has title for food_quality', () => {
        expect(content).toMatch(/food_quality:\s*['"]Food Quality['"]/);
      });

      test('has title for late_delivery', () => {
        expect(content).toMatch(/late_delivery:\s*['"]Late Delivery['"]/);
      });

      test('has title for order_never_arrived', () => {
        expect(content).toMatch(/order_never_arrived:\s*['"]Order Never Arrived['"]/);
      });

      test('has title for other', () => {
        expect(content).toMatch(/other:\s*['"]Other Issue['"]/);
      });
    });

    describe('STATUS_CONFIG', () => {
      test('has config for reported status', () => {
        expect(content).toMatch(/reported:\s*\{[\s\S]*label:\s*['"]Reported['"]/);
      });

      test('has config for under_review status', () => {
        expect(content).toMatch(/under_review:\s*\{[\s\S]*label:\s*['"]Under Review['"]/);
      });

      test('has config for resolved status', () => {
        expect(content).toMatch(/resolved:\s*\{[\s\S]*label:\s*['"]Resolved['"]/);
      });

      test('has config for refunded status', () => {
        expect(content).toMatch(/refunded:\s*\{[\s\S]*label:\s*['"]Refunded['"]/);
      });

      test('reported status has appropriate icon', () => {
        expect(content).toMatch(/reported:[\s\S]*icon:\s*['"]document-text-outline['"]/);
      });

      test('under_review status has search icon', () => {
        expect(content).toMatch(/under_review:[\s\S]*icon:\s*['"]search-outline['"]/);
      });

      test('resolved status has checkmark icon', () => {
        expect(content).toMatch(/resolved:[\s\S]*icon:\s*['"]checkmark-circle-outline['"]/);
      });

      test('refunded status has card icon', () => {
        expect(content).toMatch(/refunded:[\s\S]*icon:\s*['"]card-outline['"]/);
      });
    });

    describe('STATUS_ORDER', () => {
      test('STATUS_ORDER contains reported', () => {
        expect(content).toMatch(/STATUS_ORDER[\s\S]*['"]reported['"]/);
      });

      test('STATUS_ORDER contains under_review', () => {
        expect(content).toMatch(/STATUS_ORDER[\s\S]*['"]under_review['"]/);
      });

      test('STATUS_ORDER contains resolved', () => {
        expect(content).toMatch(/STATUS_ORDER[\s\S]*['"]resolved['"]/);
      });
    });
  });

  describe('Components', () => {
    test('defines TimelineStep component', () => {
      expect(content).toMatch(/function\s+TimelineStep\s*\(/);
    });

    test('defines IssueSummaryCard component', () => {
      expect(content).toMatch(/function\s+IssueSummaryCard\s*\(/);
    });

    test('defines ResolutionCard component', () => {
      expect(content).toMatch(/function\s+ResolutionCard\s*\(/);
    });

    test('defines ContactSupportCard component', () => {
      expect(content).toMatch(/function\s+ContactSupportCard\s*\(/);
    });
  });

  describe('TimelineStep Component', () => {
    test('receives status prop', () => {
      expect(content).toMatch(/interface\s+TimelineStepProps[\s\S]*status:\s*IssueStatus/);
    });

    test('receives label prop', () => {
      expect(content).toMatch(/interface\s+TimelineStepProps[\s\S]*label:\s*string/);
    });

    test('receives description prop', () => {
      expect(content).toMatch(/interface\s+TimelineStepProps[\s\S]*description:\s*string/);
    });

    test('receives isCompleted prop', () => {
      expect(content).toMatch(/interface\s+TimelineStepProps[\s\S]*isCompleted:\s*boolean/);
    });

    test('receives isCurrent prop', () => {
      expect(content).toMatch(/interface\s+TimelineStepProps[\s\S]*isCurrent:\s*boolean/);
    });

    test('receives isLast prop', () => {
      expect(content).toMatch(/interface\s+TimelineStepProps[\s\S]*isLast:\s*boolean/);
    });

    test('receives timestamp prop', () => {
      expect(content).toMatch(/interface\s+TimelineStepProps[\s\S]*timestamp\?:\s*Date/);
    });

    test('has pulse animation for current step', () => {
      expect(content).toMatch(/withRepeat/);
    });

    test('uses Animated.View for timeline icon', () => {
      expect(content).toMatch(/Animated\.View[\s\S]*timelineIconContainer/);
    });
  });

  describe('IssueSummaryCard Component', () => {
    test('receives issue prop', () => {
      expect(content).toMatch(/interface\s+IssueSummaryCardProps[\s\S]*issue:\s*Issue/);
    });

    test('receives order prop', () => {
      expect(content).toMatch(/interface\s+IssueSummaryCardProps[\s\S]*order:\s*Order\s*\|\s*null/);
    });

    test('displays category badge', () => {
      expect(content).toMatch(/categoryBadge/);
    });

    test('displays issue ID', () => {
      expect(content).toMatch(/issue\.id/);
    });

    test('displays restaurant info when order exists', () => {
      expect(content).toMatch(/order\.restaurant/);
    });

    test('displays issue description', () => {
      expect(content).toMatch(/issue\.description/);
    });

    test('displays attached photos when available', () => {
      expect(content).toMatch(/issue\.photos/);
    });

    test('displays reported date', () => {
      expect(content).toMatch(/formatDate\(issue\.createdAt\)/);
    });
  });

  describe('ResolutionCard Component', () => {
    test('receives issue prop', () => {
      expect(content).toMatch(/interface\s+ResolutionCardProps[\s\S]*issue:\s*Issue/);
    });

    test('checks if issue is resolved or refunded', () => {
      expect(content).toMatch(
        /issue\.status\s*===\s*['"]resolved['"].*issue\.status\s*===\s*['"]refunded['"]/
      );
    });

    test('displays resolution date when available', () => {
      expect(content).toMatch(/issue\.resolvedAt/);
    });

    test('displays resolution details when available', () => {
      expect(content).toMatch(/issue\.resolution/);
    });

    test('uses success colors', () => {
      expect(content).toMatch(/colors\.success/);
      expect(content).toMatch(/colors\.successLight/);
    });
  });

  describe('ContactSupportCard Component', () => {
    test('receives onPress prop', () => {
      expect(content).toMatch(
        /interface\s+ContactSupportCardProps[\s\S]*onPress:\s*\(\)\s*=>\s*void/
      );
    });

    test('has scale animation on press', () => {
      expect(content).toMatch(/handlePressIn/);
      expect(content).toMatch(/handlePressOut/);
    });

    test('displays contact title', () => {
      expect(content).toMatch(/Need more help\?/);
    });

    test('displays contact description', () => {
      expect(content).toMatch(/Contact our support team/);
    });

    test('uses chatbubbles icon', () => {
      expect(content).toMatch(/chatbubbles-outline/);
    });
  });

  describe('Main Screen Features', () => {
    test('uses useLocalSearchParams for issueId', () => {
      expect(content).toMatch(/useLocalSearchParams.*issueId/);
    });

    test('uses useIssueStore', () => {
      expect(content).toMatch(/useIssueStore/);
    });

    test('fetches issue by ID', () => {
      expect(content).toMatch(/getIssueById/);
    });

    test('fetches order data', () => {
      expect(content).toMatch(/getOrderById/);
    });

    test('calculates current status index', () => {
      expect(content).toMatch(/getStatusIndex/);
    });

    test('has loading state', () => {
      expect(content).toMatch(/isLoading/);
    });

    test('has error state for issue not found', () => {
      expect(content).toMatch(/Issue Not Found/);
    });

    test('has go back handler', () => {
      expect(content).toMatch(/handleGoBack/);
    });

    test('has contact support handler', () => {
      expect(content).toMatch(/handleContactSupport/);
    });
  });

  describe('Navigation', () => {
    test('uses expo-router for navigation', () => {
      expect(content).toMatch(/import.*useRouter.*from\s+['"]expo-router['"]/);
    });

    test('uses router.back for going back', () => {
      expect(content).toMatch(/router\.back\(\)/);
    });

    test('navigates to support on contact', () => {
      expect(content).toMatch(/router\.push\(['"]\/support['"]\)/);
    });
  });

  describe('UI Elements', () => {
    test('has header with back button', () => {
      expect(content).toMatch(/backButton/);
    });

    test('has header title "Issue Status"', () => {
      expect(content).toMatch(/Issue Status/);
    });

    test('has ScrollView for content', () => {
      expect(content).toMatch(/<ScrollView/);
    });

    test('has section title for timeline', () => {
      expect(content).toMatch(/Status Timeline/);
    });

    test('has info note about response time', () => {
      expect(content).toMatch(/24-48 hours/);
    });
  });

  describe('Animations', () => {
    test('imports react-native-reanimated', () => {
      expect(content).toMatch(/from\s+['"]react-native-reanimated['"]/);
    });

    test('uses FadeInDown animation', () => {
      expect(content).toMatch(/FadeInDown/);
    });

    test('uses FadeInLeft for timeline steps', () => {
      expect(content).toMatch(/FadeInLeft/);
    });

    test('uses withSpring for interactive animations', () => {
      expect(content).toMatch(/withSpring/);
    });

    test('uses withRepeat for pulse animation', () => {
      expect(content).toMatch(/withRepeat/);
    });

    test('uses useAnimatedStyle', () => {
      expect(content).toMatch(/useAnimatedStyle/);
    });

    test('uses useSharedValue', () => {
      expect(content).toMatch(/useSharedValue/);
    });
  });

  describe('Accessibility', () => {
    test('has accessibility role on back button', () => {
      expect(content).toMatch(/accessibilityRole.*button/);
    });

    test('has accessibility label on back button', () => {
      expect(content).toMatch(/accessibilityLabel.*[Gg]o\s*back/);
    });

    test('has accessibility label on contact support', () => {
      expect(content).toMatch(/accessibilityLabel.*[Cc]ontact\s*support/);
    });
  });

  describe('Styling', () => {
    test('uses StyleSheet.create', () => {
      expect(content).toMatch(/StyleSheet\.create/);
    });

    test('imports design system constants', () => {
      expect(content).toMatch(/Colors/);
      expect(content).toMatch(/Spacing/);
      expect(content).toMatch(/Typography/);
      expect(content).toMatch(/BorderRadius/);
      expect(content).toMatch(/from\s+['"]@\/constants\/theme['"]/);
    });

    test('uses useSafeAreaInsets', () => {
      expect(content).toMatch(/useSafeAreaInsets/);
    });

    test('uses useColorScheme for theming', () => {
      expect(content).toMatch(/useColorScheme/);
    });

    test('defines timeline styles', () => {
      expect(content).toMatch(/timelineStep/);
      expect(content).toMatch(/timelineIconContainer/);
      expect(content).toMatch(/timelineLine/);
      expect(content).toMatch(/timelineContent/);
    });

    test('defines loading styles', () => {
      expect(content).toMatch(/loadingContainer/);
      expect(content).toMatch(/loadingSpinner/);
    });

    test('defines error styles', () => {
      expect(content).toMatch(/errorContainer/);
      expect(content).toMatch(/errorTitle/);
    });
  });

  describe('Card Component Usage', () => {
    test('uses Card component', () => {
      expect(content).toMatch(/<Card/);
    });

    test('uses Card with outlined variant', () => {
      expect(content).toMatch(/variant=["']outlined["']/);
    });

    test('uses Card with filled variant', () => {
      expect(content).toMatch(/variant=["']filled["']/);
    });
  });
});

// ============================================================================
// Helper Functions Tests
// ============================================================================

describe('Helper Functions', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/status/[issueId].tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  describe('formatDate', () => {
    test('formatDate function is defined', () => {
      expect(content).toMatch(/function\s+formatDate\s*\(/);
    });

    test('formatDate returns formatted date string', () => {
      expect(content).toMatch(/toLocaleDateString/);
    });

    test('formatDate uses proper date format options', () => {
      expect(content).toMatch(/month:\s*['"]short['"]/);
      expect(content).toMatch(/day:\s*['"]numeric['"]/);
      expect(content).toMatch(/year:\s*['"]numeric['"]/);
    });
  });

  describe('getStatusIndex', () => {
    test('getStatusIndex function is defined', () => {
      expect(content).toMatch(/function\s+getStatusIndex\s*\(/);
    });

    test('getStatusIndex handles refunded status', () => {
      expect(content).toMatch(/status\s*===\s*['"]refunded['"]/);
    });

    test('getStatusIndex uses STATUS_ORDER.indexOf', () => {
      expect(content).toMatch(/STATUS_ORDER\.indexOf/);
    });
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Issue Status Screen Integration', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/status/[issueId].tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('imports Issue type from types', () => {
    expect(content).toMatch(/import.*Issue.*from\s+['"]@\/types['"]/);
  });

  test('imports IssueStatus type from types', () => {
    expect(content).toMatch(/import.*IssueStatus.*from\s+['"]@\/types['"]/);
  });

  test('imports Order type from types', () => {
    expect(content).toMatch(/import.*Order.*from\s+['"]@\/types['"]/);
  });

  test('imports useIssueStore from stores', () => {
    expect(content).toMatch(/import.*useIssueStore.*from\s+['"]@\/stores['"]/);
  });

  test('imports getOrderById from mock data', () => {
    expect(content).toMatch(/import.*getOrderById.*from\s+['"]@\/data\/mock\/orders['"]/);
  });

  test('imports Card component from ui', () => {
    expect(content).toMatch(/import.*Card.*from\s+['"]@\/components\/ui['"]/);
  });
});

// ============================================================================
// Navigation Layout Tests
// ============================================================================

describe('Support Layout Configuration', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/support/_layout.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(layoutPath, 'utf-8');
  });

  test('layout includes issue status screen route', () => {
    expect(content).toMatch(/issue\/status\/\[issueId\]/);
  });

  test('issue status screen has card presentation', () => {
    expect(content).toMatch(
      /name=["']issue\/status\/\[issueId\][\s\S]*presentation:\s*['"]card['"]/
    );
  });
});
