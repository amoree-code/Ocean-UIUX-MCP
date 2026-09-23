"use client"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireTitle,
} from "@/styles/luma/ui/questionnaire"

const items = [
  {
    choices: [{ value: "bug" }, { value: "feature" }, { value: "question" }],
    name: "type",
    required: true,
  },
] as const

export default function QuestionnairePreview() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center">
      <Questionnaire className="w-full" defaultItem="type" items={items}>
        <QuestionnaireItem name="type" required>
          <QuestionnaireTitle>What kind of ticket is this?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="bug">Bug report</QuestionnaireChoice>
            <QuestionnaireChoice value="feature">
              Feature request
            </QuestionnaireChoice>
            <QuestionnaireChoice value="question">Question</QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext />
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}
