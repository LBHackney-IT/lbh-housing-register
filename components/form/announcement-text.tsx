import React from 'react';
import { AnnouncementTextFormField } from '../../lib/types/form';
import Announcement from '../announcement';

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
              {list.map((content: string, index) => (
                <li key={index}>{content}</li>
              ))}
            </ul>
          )}
        </div>
      </>
    </Announcement>
  );
}
