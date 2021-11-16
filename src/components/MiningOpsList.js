import { useQuery } from '@apollo/client';
import { GQLMe } from '../GraphQLClient';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function MiningOpsList ()
{
    const { loading, error, data } = useQuery(GQLMe);

    function List({me}) {
        me = me();
        if (!me.miningObservers || me.miningObservers.length == 0) {
            return '';
        }
        return (
            <div>
                {me.miningObservers.map( op =>
                    <div><Link to={{pathname: 'view/?corporationId='+me.corporationId + '&observerId=' + op.observerId + '&date=' + op.lastUpdated}}>{op.lastUpdated} ({op.structure.name})</Link></div>
                )}
            </div>
        );
    }
    function RetrieveMiningOps()
    {
        if (loading) return [];
        if (error) return [];
        if (data && data.me) {
            return data.me;
        }
        return [];
    }

    return (
        <List me = {RetrieveMiningOps} />
    );
}
