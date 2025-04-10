import * as React from 'react';
import { ITransferRecord } from '../../interfaces/iTransferRecord';
import { TransferData } from '../../data/transfers';
import Badge from '@mui/material/Badge';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export interface ITransferMatrixProps { }

export const TransferMatrix: React.FunctionComponent<ITransferMatrixProps> = (props: React.PropsWithChildren<ITransferMatrixProps>) => {
    const [conferences, setConferences] = React.useState<string[]>([]);
    const [teams, setTeams] = React.useState<{ name: string, conference: string }[]>([]);
    const [transfers, setTransfers] = React.useState<ITransferRecord[]>(TransferData);

    const GetConferenceTransferToCount = (conference: string) => {
        return transfers.filter((transfer) => transfer.toConferenceName === conference).length;
    }

    const GetConferenceTransferFromCount = (conference: string) => {
        return transfers.filter((transfer) => transfer.fromConferenceName === conference).length;
    }

    const GetTeamTransferToCount = (team: string) => {
        return transfers.filter((transfer) => transfer.toSchoolName === team).length;
    }

    const GetTeamTransferFromCount = (team: string) => {
        return transfers.filter((transfer) => transfer.fromSchoolName === team).length;
    }

    React.useEffect(() => {
        // iterate through the transfers and get the unique conferences and teams
        const uniqueConferences: string[] = [];
        const uniqueTeams: { name: string, conference: string }[] = [];
        transfers.forEach((transfer) => {
            // check if transfer from and to conference is in uniqueConferences. if it is not, add it
            if (transfer.fromConferenceName && !uniqueConferences.includes(transfer.fromConferenceName)) {
                console.log('adding conference', transfer.fromConferenceName);
                uniqueConferences.push(transfer.fromConferenceName);
            }
            if (transfer.toConferenceName && !uniqueConferences.includes(transfer.toConferenceName)) {
                uniqueConferences.push(transfer.toConferenceName);
            }
            // check if transfer from and to school is in uniqueTeams. if it is not, add it
            if (transfer.fromSchoolName && !uniqueTeams.some(team => team.name === transfer.fromSchoolName)) {
                uniqueTeams.push({ name: transfer.fromSchoolName, conference: transfer.fromConferenceName || '' });
            }
            if (transfer.toSchoolName && !uniqueTeams.some(team => team.name === transfer.toSchoolName)) {
                uniqueTeams.push({ name: transfer.toSchoolName, conference: transfer.toConferenceName || '' });
            }
        }
        );
        setConferences(uniqueConferences);
        setTeams(uniqueTeams);
    }, []);

    return (
        <>
            {
                // iterate through each conference and list the teams under each conference.  do not add transfer data yet
                conferences
                    .sort((a, b) => a.localeCompare(b)) // Sort conferences alphabetically
                    .map((conference) => (
                        <Accordion key={conference}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'start',
                                        alignItems: 'center',
                                        gap: '30px' // Add spacing between badges
                                    }}
                                >
                                    <h2>{conference}</h2>
                                    <Badge badgeContent={GetConferenceTransferFromCount(conference)} color="error" title="Transfers OUT" />
                                    <Badge badgeContent={GetConferenceTransferToCount(conference)} color="success" title="Transfers IN" />
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>

                                {
                                    teams
                                        .filter(team => team.conference === conference)
                                        .sort((a, b) => a.name.localeCompare(b.name)) // Sort teams alphabetically
                                        .map((team) => (
                                            <Accordion key={team.name}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                >
                                                    <div
                                                        key={team.name}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'start',
                                                            alignItems: 'center',
                                                            gap: '30px' // Add spacing between badges
                                                        }}
                                                    >
                                                        {team.name}
                                                        <Badge badgeContent={GetTeamTransferFromCount(team.name)} color="error" title="Transfers OUT" />
                                                        <Badge badgeContent={GetTeamTransferToCount(team.name)} color="success" title="Transfers IN" />
                                                    </div>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <h3>Transfers OUT</h3>
                                                    {
                                                        transfers
                                                            .filter(transfer => transfer.fromSchoolName === team.name)
                                                            .map((transfer) => (
                                                                <li key={transfer.id}>
                                                                    {transfer.playerFirstName} {transfer.playerLastName} ({transfer.playerPosition}) - {transfer.playerEligibilityYear} TO {transfer.toSchoolName ? transfer.toSchoolName : 'N/A'}
                                                                </li>
                                                            ))
                                                    }
                                                    <h3>Transfers IN</h3>
                                                    {
                                                        transfers
                                                            .filter(transfer => transfer.toSchoolName === team.name)
                                                            .map((transfer) => (
                                                                <li key={transfer.id}>
                                                                    {transfer.playerFirstName} {transfer.playerLastName} ({transfer.playerPosition}) - {transfer.transferYear}
                                                                    {
                                                                        transfer.fromSchoolName ? ` FROM ${transfer.fromSchoolName}` : 'N/A'
                                                                    }
                                                                </li>
                                                            ))
                                                    }
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                            </AccordionDetails>
                        </Accordion>

                    ))
            }
        </>
    );
};