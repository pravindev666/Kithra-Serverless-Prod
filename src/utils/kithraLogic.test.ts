import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyPhotoCropAdjustment,
  computeAssessmentProgress,
  filterProfiles,
  filterStaffCases,
  getPageTitleForRoute,
  getVisiblePhotosForIntention,
  groupAlignmentByKind,
  parsePathnameToRoute,
  reorderPhotos,
  togglePhotoIntentionVisibility,
  validateAuthForm,
} from './kithraLogic';
import {
  AssessmentQuestion,
  MemberPhoto,
  MemberProfile,
  QualitativeAlignment,
  StaffCase,
} from '../types/kithra';

const sampleAlignments: QualitativeAlignment[] = [
  {
    id: 'a-echo',
    kind: 'echo',
    theme: 'Shared evening conversational pace',
    summary: 'Both of you prefer thoughtful evening letters over rapid-fire daytime chat.',
    sharedSignals: ['Evening replies', 'Long-form notes'],
    conversationPrompt: 'Ask about their favourite neighbourhood walk.',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
  },
  {
    id: 'a-counter',
    kind: 'counterpoint',
    theme: 'Different weekend social size',
    summary: 'One enjoys hosting 8-person potlucks while the other prefers 1:1 walks.',
    sharedSignals: ['Potluck tables vs quiet walks'],
    conversationPrompt: 'Compare how you each recharge after a busy workweek.',
    applicableIntentions: ['dating', 'matrimony'],
  },
  {
    id: 'a-mosaic',
    kind: 'mosaic',
    theme: 'Planner & improviser complementarity',
    summary: 'One brings structure to travel plans while the other spots serendipitous stops.',
    sharedSignals: ['Structured itinerary + local detours'],
    conversationPrompt: 'Share a memorable trip where plans changed for the better.',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
  },
];

const sampleProfiles: MemberProfile[] = [
  {
    id: 'm1',
    name: 'Aarav Iyer',
    ageRange: '29',
    city: 'Bengaluru',
    languages: ['English', 'Tamil'],
    intentions: ['friendship', 'dating'],
    primaryIntention: 'friendship',
    headline: 'Architect and weekend long-distance walker',
    bio: 'Enjoys slow Sunday walks and reading history.',
    interests: ['Architecture', 'Books', 'Filter coffee'],
    paceNote: 'Prefers thoughtful messages over rapid-fire chat.',
    occupation: 'Conservation Architect',
    portraitVariant: 'member-aarav',
    alignment: sampleAlignments,
    measuredDimensions: [],
    connectionState: 'discover',
    saved: true,
  },
  {
    id: 'm2',
    name: 'Meera Nair',
    ageRange: '31',
    city: 'Chennai',
    languages: ['English', 'Malayalam', 'Tamil'],
    intentions: ['matrimony'],
    primaryIntention: 'matrimony',
    headline: 'Classical listener and medical researcher',
    bio: 'Looking for a grounded partnership built on mutual respect.',
    interests: ['Carnatic music', 'Coastal walks', 'Cooking'],
    paceNote: 'Likes moving from messages to a calm phone call within two weeks.',
    occupation: 'Clinical Researcher',
    portraitVariant: 'member-meera',
    alignment: [],
    measuredDimensions: [],
    connectionState: 'discover',
    saved: false,
  },
];

test('filterProfiles filters by intention, city, saved status, and search query', () => {
  const friendshipOnly = filterProfiles(sampleProfiles, {
    intention: 'friendship',
    city: 'All cities',
    searchQuery: '',
    savedOnly: false,
  });
  assert.equal(friendshipOnly.length, 1);
  assert.equal(friendshipOnly[0].id, 'm1');

  const chennaiOnly = filterProfiles(sampleProfiles, {
    intention: 'all',
    city: 'Chennai',
    searchQuery: '',
    savedOnly: false,
  });
  assert.equal(chennaiOnly.length, 1);
  assert.equal(chennaiOnly[0].id, 'm2');

  const queryMatch = filterProfiles(sampleProfiles, {
    intention: 'all',
    city: 'All cities',
    searchQuery: 'carnatic',
    savedOnly: false,
  });
  assert.equal(queryMatch.length, 1);
  assert.equal(queryMatch[0].name, 'Meera Nair');
});

test('validateAuthForm enforces email, password, and join fields', () => {
  const emptyResult = validateAuthForm({ mode: 'signin', email: '', password: '' });
  assert.equal(emptyResult.valid, false);
  assert.ok(emptyResult.errors.email);
  assert.ok(emptyResult.errors.password);

  const validSignIn = validateAuthForm({
    mode: 'signin',
    email: 'member@kithra.example',
    password: 'thoughtful-password',
  });
  assert.equal(validSignIn.valid, true);

  const incompleteJoin = validateAuthForm({
    mode: 'join',
    email: 'new@kithra.example',
    password: 'thoughtful-password',
    fullName: '',
    city: '',
  });
  assert.equal(incompleteJoin.valid, false);
  assert.ok(incompleteJoin.errors.fullName);
  assert.ok(incompleteJoin.errors.city);
});

test('togglePhotoIntentionVisibility, reorderPhotos, and applyPhotoCropAdjustment update state cleanly', () => {
  const photos: MemberPhoto[] = [
    {
      id: 'p1',
      title: 'Primary courtyard portrait',
      caption: 'Morning light in Indiranagar',
      altText: 'Aarav standing on a sunlit veranda',
      isPrimary: true,
      aspectRatio: '4:5',
      variant: 'photo-primary',
      crop: { zoom: 1, panX: 0, panY: 0, rotation: 0 },
      visibleIn: { friendship: true, dating: false, matrimony: true },
      moderationStatus: 'Approved',
    },
    {
      id: 'p2',
      title: 'Bookshop table',
      caption: 'Sunday reading session',
      altText: 'Two filter coffee cups on a bookshop table',
      isPrimary: false,
      aspectRatio: '1:1',
      variant: 'photo-secondary',
      crop: { zoom: 1, panX: 0, panY: 0, rotation: 0 },
      visibleIn: { friendship: true, dating: true, matrimony: false },
      moderationStatus: 'Approved',
    },
  ];

  const toggled = togglePhotoIntentionVisibility(photos, 'p1', 'dating');
  assert.equal(toggled[0].visibleIn.dating, true);
  assert.equal(getVisiblePhotosForIntention(toggled, 'dating').length, 2);

  const reordered = reorderPhotos(toggled, 'p2', 'up');
  assert.equal(reordered[0].id, 'p2');
  assert.equal(reordered[0].isPrimary, true);
  assert.equal(reordered[1].isPrimary, false);

  const cropped = applyPhotoCropAdjustment(photos[0].crop, {
    zoom: 2.8,
    panX: -12,
    panY: 60,
    rotation: 90,
  });
  assert.equal(cropped.zoom, 2.2);
  assert.equal(cropped.panX, -12);
  assert.equal(cropped.panY, 40);
  assert.equal(cropped.rotation, 90);
});

test('parsePathnameToRoute, getPageTitleForRoute, and groupAlignmentByKind work across routes and intentions', () => {
  const matchRoute = parsePathnameToRoute('/member/match/member-meera');
  assert.equal(matchRoute.section, 'member');
  assert.equal(matchRoute.memberTab, 'match');
  assert.equal(matchRoute.matchMemberId, 'member-meera');
  assert.match(getPageTitleForRoute(matchRoute), /Echo, Counterpoint & Mosaic Fit/);

  const adminLoginRoute = parsePathnameToRoute('/admin/login');
  assert.equal(adminLoginRoute.section, 'admin-login');

  const unknownRoute = parsePathnameToRoute('/non-existent-url-path');
  assert.equal(unknownRoute.section, 'states');
  assert.equal(unknownRoute.stateCode, '404');

  const groupedFriendship = groupAlignmentByKind(sampleAlignments, 'friendship');
  assert.equal(groupedFriendship.echo.length, 1);
  assert.equal(groupedFriendship.counterpoint.length, 0);
  assert.equal(groupedFriendship.mosaic.length, 1);

  const groupedDating = groupAlignmentByKind(sampleAlignments, 'dating');
  assert.equal(groupedDating.counterpoint.length, 1);
});

test('filterStaffCases and computeAssessmentProgress return accurate results', () => {
  const cases: StaffCase[] = [
    {
      id: 'K-101',
      category: 'Impersonation concern',
      priority: 'High',
      status: 'Awaiting review',
      reportedContext: 'Profile photo mismatch report',
      submittedAt: '2 hours ago',
      assignedTo: 'Trust Queue',
      summary: 'Member flagged possible duplicate profile.',
      notes: [],
    },
    {
      id: 'K-102',
      category: 'Photo report',
      priority: 'Normal',
      status: 'In queue',
      reportedContext: 'Group photo crop check',
      submittedAt: '5 hours ago',
      assignedTo: 'Photo Review',
      summary: 'Primary photo contains multiple people.',
      notes: [],
    },
  ];

  const highOnly = filterStaffCases(cases, { priority: 'High', status: 'All', query: '' });
  assert.equal(highOnly.length, 1);
  assert.equal(highOnly[0].id, 'K-101');

  const questions: AssessmentQuestion[] = [
    {
      id: 'q1',
      themeId: 'theme-1',
      questionNumber: 1,
      module: 'Conversational Pace & Presence',
      intentionScope: 'All intentions',
      applicableIntentions: ['friendship', 'dating', 'matrimony'],
      prompt: 'How do you prefer a new connection to unfold?',
      context: 'Helps align conversation pace.',
      whyWeAsk: 'Prevents misreading workweek silence.',
      options: [
        {
          id: 'o1',
          label: 'Slow and steady',
          reflection: 'Unhurried pace',
          signalEffect: 'Echo on conversational cadence',
        },
      ],
    },
    {
      id: 'q2',
      themeId: 'theme-2',
      questionNumber: 21,
      module: 'Everyday Values & Repair',
      intentionScope: 'All intentions',
      applicableIntentions: ['friendship', 'dating', 'matrimony'],
      prompt: 'What makes a disagreement constructive?',
      context: 'Helps surface conflict styles.',
      whyWeAsk: 'Clarifies repair habits.',
      options: [
        {
          id: 'o2',
          label: 'Listening first',
          reflection: 'Calm dialogue',
          signalEffect: 'Echo on repair style',
        },
      ],
    },
  ];

  const progress = computeAssessmentProgress(questions, { q1: 'o1' });
  assert.equal(progress.answeredCount, 1);
  assert.equal(progress.totalCount, 2);
  assert.equal(progress.percent, 50);
});
