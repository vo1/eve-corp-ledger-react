import { useQuery } from '@apollo/client';
import { GQLGetSelfWithCorporationMiningObservers } from '../GraphQLClient';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function MiningOpsList ()
{
    const { loading, error, data } = useQuery(GQLGetSelfWithCorporationMiningObservers);

    function List({me}) {
        me = me();
        if (!me.miningObservers || me.miningObservers.length == 0) {
            return '';
        }
        return (
            <div>
                {me.miningObservers.map( op =>
                    <div><Link to={{pathname: 'view/?corporationId='+me.corporationId + '&observerId=' + op.observerId }}>{op.lastUpdated} ({op.structure.name})</Link></div>
                )}
            </div>
        );
    }
    function RetrieveMiningOps()
    {
        if (loading) return [];
        if (error) return [];
        if (data && data.getSelf) {
            return data.getSelf;
        }
        return [];
    }

    return (
        <List me = {RetrieveMiningOps} />
    );
}
