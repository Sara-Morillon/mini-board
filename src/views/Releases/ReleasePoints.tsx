import React from 'react'
import { Issue } from '../../models/Issue'
import { Release } from '../../models/Release'

interface IIssuePointsProps {
  release: Release
}

export function ReleasePoints({ release }: IIssuePointsProps): JSX.Element {
  const totalPoints = release.issues.reduce(countPoints, 0)
  const donePoints = release.issues.filter((issue) => issue.status === 'done').reduce(countPoints, 0)

  return (
    <span className="float-right">
      {donePoints}/{totalPoints} points
    </span>
  )
}

function countPoints(acc: number, curr: Issue): number {
  return acc + curr.points
}
