import type { ExperienceSlice } from './experience'

// ponytail: development slice only; replace this route's source when /api/experience exists.
export const demoExperience: ExperienceSlice = {
  settings: {
    recipientName: 'Recipient Name',
    nickname: '',
    birthdayDate: null,
    relationshipStartDate: null,
    relationshipCounterVisible: false,
    closingSignature: '',
    themePreset: 'lavender_mist',
  },
  hero: { title: 'FOR', subtitle: 'WITH LOVE' },
  intro: {
    message: {
      blocks: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'A little place for the moments that matter.',
            },
          ],
        },
      ],
    },
    supportingText: '',
  },
}
