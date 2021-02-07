/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState, useEffect, useCallback } from 'react';
import semver from 'semver';

import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../helpers/connect-component';

import appJson from '../../constants/app-json';

import { requestOpenInBrowser } from '../../senders';
import { isDefaultMailClientAsync } from '../../invokers';

const ListItemDefaultMailClient = () => {
  const [isDefault, setIsDefault] = useState(false);

  const isWindows10 = window.process.platform === 'win32' && semver.gt(window.remote.require('os').release(), '10.0.0');

  const recheckIsDefault = useCallback(
    () => {
      isDefaultMailClientAsync()
        .then((result) => {
          setIsDefault(result);
        });
    },
    [],
  );

  // recheck every 1 minutes
  useEffect(() => {
    recheckIsDefault();
    const timer = setInterval(() => {
      recheckIsDefault();
    }, 60 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, [recheckIsDefault]);

  if (isDefault) {
    return (
      <ListItem>
        <ListItemText secondary={`${appJson.name} is your default email client.`} />
      </ListItem>
    );
  }

  // open ms-settings on Windows 10
  // as Windows 10 doesn't allow changing default app programmatically
  if (isWindows10) {
    return (
      // https://docs.microsoft.com/en-us/windows/uwp/launch-resume/launch-settings-app
      <ListItem button onClick={() => requestOpenInBrowser('ms-settings:defaultapps')}>
        <ListItemText primary="Default email client" secondary={`Make ${appJson.name} the default email client.`} />
        <ChevronRightIcon color="action" />
      </ListItem>
    );
  }

  return (
    <ListItem>
      <ListItemText primary="Default email client" secondary={`Make ${appJson.name} the default email client.`} />
      <Button
        variant="outlined"
        size="small"
        color="default"
        onClick={() => {
          window.remote.app.setAsDefaultProtocolClient('mailto');
          recheckIsDefault();
        }}
      >
        Make default
      </Button>
    </ListItem>
  );
};

export default connectComponent(
  ListItemDefaultMailClient,
  null,
  null,
  null,
);
