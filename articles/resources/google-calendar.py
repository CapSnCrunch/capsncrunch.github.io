######################################
#  This is a script to pull your data from Google Calendar. 
#  If you don't care about the color of your events, Google
#  Takeout (https://takeout.google.com/settings/takeout?pli=1)
#  is a much more direct alternative. 
# 
#  Otherwise, if you care about the event colors like me, you will
#  need to set up a service account through GCP and run this script:
#    1. Start a new project from the GCP conosle: https://console.cloud.google.com/products/solutions/catalog?_ga=2.132850310.908105719.1719091461-637968267.1718552553&_gac=1.157345480.1719091461.CjwKCAjw7NmzBhBLEiwAxrHQ-R8hMh1I36CVZBEuYIjvhWWmOWjRn8nkI2kHeZR2eOLqKGo40mTuxxoCbM0QAvD_BwE&_gl=1*1bffyh3*_up*MQ..&gclid=CjwKCAjw7NmzBhBLEiwAxrHQ-R8hMh1I36CVZBEuYIjvhWWmOWjRn8nkI2kHeZR2eOLqKGo40mTuxxoCbM0QAvD_BwE&gclsrc=aw.ds&pli=1
#    2. Enable the Google Calendar API for your project: https://console.cloud.google.com/marketplace/product/google/calendar-json.googleapis.com?q=search&referrer=search&project=personal-426615
#    3. Configure OAuth Credentials:
#        - Navigate to APIs & Services > OAuth Consent Screen
#        - Select User Type: External
#        - Enter some app name, support email, etc. (these don't matter too much)
#        - Can leave authorized domains blank
#        - Add Scopes: (https://www.googleapis.com/auth/calendar.readonly)
#        - Save and Continue
#    4. Configure a Test User with your email
#    5. Create OAuth 2.0 Credentials
#        - Navigate to APIs & Services > OAuth Client ID
#        - Create Credentials > OAuth Client ID
#        - Give the credentials some name (eg. 'Personal Calendar Access')
#        - Download JSON
#        - Store your credentials.json in the same directory as this script
#    6. pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
#    7. Configure the time window you want to 
#    8. python google-calendar.py
#
######################################

import os.path
import pickle
import csv

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# If modifying these SCOPES, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

### CONFIGURE YOUR OWN TIMES HERE
start = '2023-01-01T00:00:00Z'
end = '2024-12-31T23:59:59Z'

### CONFIGURE OUTPUT FILE NAME (CSV)
output_file_name = 'calendar_events_2023-2024.csv'

def main():
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('calendar', 'v3', credentials=creds)

    # Call the Calendar API
    print(f'Getting all events from ${start} to ${end}')

    events = []
    page_token = None
    while True:
        events_result = service.events().list(
            calendarId='primary', 
            timeMin=start,
            timeMax=end, 
            singleEvents=True,
            orderBy='startTime',
            maxResults=250,
            pageToken=page_token
        ).execute()
        events.extend(events_result.get('items', []))
        page_token = events_result.get('nextPageToken')
        if not page_token:
            break

        print(page_token)
        print('Event Count:', len(events))
        print(events_result.get('items')[0]['start'])
        print()

    if not events:
        print('No events found for ${start} to ${end}.')
        return

    # Prepare to write to CSV
    with open(output_file_name, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Name', 'Color', 'Start', 'End'])  # CSV header

        for event in events:
            start = event['start'].get('dateTime', event['start'].get('date'))
            end = event['end'].get('dateTime', event['end'].get('date'))
            name = event.get('summary', 'No Title')
            color_id = event.get('colorId', '0')  # Not all events have a colorId

            writer.writerow([name, color_id, start, end])

    print(f'Events saved to ${output_file_name}')

if __name__ == '__main__':
    main()