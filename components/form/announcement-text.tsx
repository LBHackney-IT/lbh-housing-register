import React from 'react';
import { AnnouncementTextFormField } from '../../lib/types/form';
import Announcement from '../announcement';
import { v4 as uniqueID } from 'uuid';

export default function AnnouncementText({
  title,
  content,
  list,
  variant,
}: AnnouncementTextFormField): JSX.Element {
  return (
    <Announcement variant={variant ?? 'success'}>
      <>
        {title && <h3 className="lbh-page-announcement__title">{title}</h3>}
        <div className="lbh-page-announcement__content">
          {content && <p className="lbh-body-m">{content}</p>}
          {list && (
            <ul>
              {list.map((content: string) => (
                <li key={uniqueID()}>{content}</li>
              ))}
            </ul>
          )}
        </div>
      </>
    </Announcement>
  );
}
