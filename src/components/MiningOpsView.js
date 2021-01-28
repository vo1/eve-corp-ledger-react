import { useQuery } from '@apollo/client';
import { GQLGetCorporationMiningObserverEntries } from '../GraphQLClient';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function MiningOpsView ()
{
    let totalQuantities = [];
    const params = new URLSearchParams(window.location.search);
    const corporationId = params.get('corporationId');
    const observerId = params.get('observerId');
    const { loading, error, data } = useQuery(GQLGetCorporationMiningObserverEntries,  { variables: { corporationId, observerId }});

    function List({data}) {
        data = data();
        return (
            <dl>
                <dt>Name</dt>
                <dd>Share</dd>
                {Object.keys(data).map(characterId =>
                    <>
                        <dt>{data[characterId].character.name}</dt>
                        <dd>{data[characterId].share}</dd>
                    </>
                )}
            </dl>
        );
    }

    function Totals({data})
    {
        return(
            <dl>
                <dt>Name</dt>
                <dd>Quantity</dd>
            {data.map(item =>
                <>
                    <dt>{item.type.name}</dt>
                    <dd>{item.quantity} ({item.quantity * item.type.volume} m3)</dd>
                </>
            )}
            </dl>
        );
    }

    function RetrieveMiningOpView()
    {
        if (loading) return [];
        if (error) return [];
        if (data && data.getCorporationMiningObserverEntries) {
            let result = {};
            let totalVolume = 0;
            data.getCorporationMiningObserverEntries.forEach(item => {
                if (typeof(result[item.characterId] === 'undefined')) {
                    result[item.characterId] = {
                        character: item.character,
                        volume: 0,
                        share: 0,
                        items: [],
                    };
                }
                result[item.characterId].items.push({
                    typeId: item.typeId,
                    quantity: item.quantity,
                    type: item.type
                });
                if (typeof(totalQuantities[item.typeId]) === 'undefined') {
                    totalQuantities[item.typeId] = { quantity: 0, volume: 0, type: item.type };
                }
                totalQuantities[item.typeId].quantity += item.quantity;
                totalQuantities[item.typeId].volume += item.quantity * item.type.volume;
                totalVolume += item.quantity * item.type.volume;
                result[item.characterId].volume += item.quantity * item.type.volume;
            });
            Object.keys(result).map(characterId => {
                result[characterId].share = (100 * result[characterId].volume / totalVolume).toFixed(2);
            })
            return result;
        }
        return [];
    }

    return (
        <>
        <List data = {RetrieveMiningOpView} />
        <Totals data = {totalQuantities} />
        </>
    );
}
