import {
  SparklesIcon,
  StarIcon,
  EyeIcon,
  RocketLaunchIcon,
  ShieldCheckIcon as ShieldCheckIconOutline,
  LightBulbIcon as LightBulbIconOutline,
  HeartIcon,
  AcademicCapIcon as AcademicCapIconOutline,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  PaintBrushIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BeakerIcon,
  MusicalNoteIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon as UserGroupIconOutline,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  PaperAirplaneIcon,
  CheckCircleIcon as CheckCircleIconOutline,
} from '@heroicons/react/24/outline';

import {
  CheckCircleIcon as CheckCircleIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  HandRaisedIcon,
  BuildingOfficeIcon,
  LightBulbIcon as LightBulbIconSolid,
  PresentationChartBarIcon,
  CpuChipIcon,
} from '@heroicons/react/24/solid';

export const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  // Outline icons
  SparklesIcon,
  StarIcon,
  EyeIcon,
  RocketLaunchIcon,
  ShieldCheckIconOutline,
  LightBulbIconOutline,
  HeartIcon,
  AcademicCapIconOutline,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  PaintBrushIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BeakerIcon,
  MusicalNoteIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIconOutline,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  PaperAirplaneIcon,
  CheckCircleIconOutline,

  // Solid icons
  CheckCircleIconSolid,
  ShieldCheckIconSolid,
  UserGroupIconSolid,
  AcademicCapIconSolid,
  HandRaisedIcon,
  BuildingOfficeIcon,
  LightBulbIconSolid,
  PresentationChartBarIcon,
  CpuChipIcon,

  // Base name aliases (map to outline variants as default)
  ShieldCheckIcon: ShieldCheckIconOutline,
  LightBulbIcon: LightBulbIconOutline,
  AcademicCapIcon: AcademicCapIconOutline,
  UserGroupIcon: UserGroupIconOutline,
  CheckCircleIcon: CheckCircleIconOutline,
};

/**
 * Retrieve an icon component by its string name.
 * Returns null if the icon name is not found in the map.
 */
export function getIcon(name: string): React.ComponentType<React.SVGProps<SVGSVGElement>> | null {
  return iconMap[name] ?? null;
}
