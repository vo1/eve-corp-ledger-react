import React from 'react';
import { useQuery } from '@apollo/client';
import { GQLMe } from '../GraphQLClient';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function StructureList ()
{
    const { loading, error, data } = useQuery(GQLMe);
    const [sortedField, setSortedField] = React.useState(null);

    function List({me}) {
        me = me();
        if (!me.structures || me.structures.length == 0) {
            return '';
        }
        let sortedStructures = [...me.structures];
        if (sortedField !== null) {
            sortedStructures.sort((a, b) => {
                let sortedA = a;
                let sortedB = b;
                let sortedElement = '';
                let _sortedField = sortedField;
                if (sortedField.indexOf('.') > 0) {
                    [ sortedElement, _sortedField ] = sortedField.split('.');
                }
                if (sortedElement.length > 0) {
                    sortedA = a[sortedElement];
                    sortedB = b[sortedElement];
                }
                return ('' + sortedA[_sortedField]).localeCompare('' + sortedB[_sortedField]);
            });
        }
        return (
            <table>
                <tr>
                <th onClick={() => setSortedField('name')}>
                        Location
                    </th>
                    <th onClick={() => setSortedField('fuelExpires')}>
                        Fuel Expires
                    </th>
                    <th onClick={() => setSortedField('state')}>
                        State
                    </th>
                    <th onClick={() => setSortedField('stateTimerEnd')}>
                        State Timer End
                    </th>
                    <th onClick={() => setSortedField('miningExtraction.chunkArrivalTime')}>
                        Chunk Time
                    </th>
                    <th onClick={() => setSortedField('miningExtraction.naturalDecayTime')}>
                        Decay Time
                    </th>
                    <th>
                        Services
                    </th>
                </tr>

                {sortedStructures.map( str =>
                    (str.name.indexOf('MLQ-O9') < 0)
                    ?   <tr>
                            <td>{str.name}</td>
                            <td>{str.fuelExpires ? str.fuelExpires.replace('T', ' ') : ''}</td>
                            <td>{str.state}</td>
                            <td>{str.stateTimerEnd ? str.stateTimerEnd.replace('T', ' ') : ''}</td>
                            <td>{(str.miningExtraction.chunkArrivalTime !== null) 
                                ? <>{str.miningExtraction.chunkArrivalTime.replace('T', ' ')}</>
                                : <b>NO EXTRACTION</b>
                            }</td>
                            <td>{(str.miningExtraction.naturalDecayTime !== null) 
                                ? <>{str.miningExtraction.naturalDecayTime.replace('T', ' ')}</>
                                : <b>NO EXTRACTION</b>
                            }</td>
                            <td>
                                {str.services.map((x) => x.name).join(';')}
                            </td>
                        </tr>
                    : <></>
                )}
            </table>
        );
    }
    function RetrieveStructureList()
    {
        if (loading) return [];
        if (error) return [];
        if (data && data.me) {
            return data.me;
        }
        return [];
    }

    return (
        <List me = {RetrieveStructureList} />
    );
}
