import React from 'react'
import { Frown } from 'react-feather'
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from 'reactstrap'

export default function Error404(): JSX.Element {
  return (
    <div className="text-center">
      <Card outline color="light" className="text-center d-inline-block">
        <CardBody>
          <CardTitle>
            <Frown size="3rem" />
          </CardTitle>
          <CardSubtitle tag="h5">Not found</CardSubtitle>
          <CardText>The page you are looking for was not found</CardText>
          <CardLink href="/">Go back home</CardLink>
        </CardBody>
      </Card>
    </div>
  )
}
