import { useQuery } from '@apollo/client';
import { GQLGetSelfWithCorporationMiningObservers } from '../GraphQLClient';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function MiningOpsList ()
{
    const { loading, error, data } = useQuery(GQLGetSelfWithCorporationMiningObservers);

    function List({ops}) {
        return (
            <div>
                {ops().map( op =>
                    <div><Link to={{pathname: 'view/' + op.observerId}}>{op.lastUpdated} ({op.structure.name})</Link></div>
                )}
            </div>
        );
    }

    function RetrieveMiningOps()
    {
        if (loading) return [];
        if (error) return [];
        if (data && data.getSelf) {
            return data.getSelf.miningObservers;
        }
        return [];
    }

    return (
        <List ops = {RetrieveMiningOps} />
    );
}
