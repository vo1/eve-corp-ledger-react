import { useQuery } from '@apollo/client';
import { GQLGetCorporationMiningObserverEntries } from '../GraphQLClient';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import settings from '../settings.js'
export default function MiningOpsView ()
{
    let totalQuantities = [];
    const params = new URLSearchParams(window.location.search);
    const corporationId = params.get('corporationId');
    const observerId = params.get('observerId');
    const { loading, error, data } = useQuery(GQLGetCorporationMiningObserverEntries,  { variables: { corporationId, observerId }});

    function ItemsHint({items})
    {
        return (
            <>
                <span class="showMore">...</span>
                <span class="hint">
                    <dl>
                        <dt>Name</dt>
                        <dd>Quantity</dd>
                        {Object.keys(items).map(itemId =>
                            <>
                                <dt>{items[itemId].type.name}</dt>
                                <dd>{items[itemId].quantity} ({items[itemId].quantity * items[itemId].type.volume} m3)</dd>
                            </>
                        )}
                    </dl>
                </span>
            </>
        )
    }
    function List({data}) {
        data = data();
        return (
            <dl>
                <dt>Name</dt>
                <dd>Share</dd>
                {Object.keys(data).map(characterId =>
                    <>
                        <dt>{data[characterId].character.name}</dt>
                        <dd>
                            {data[characterId].share}
                            <ItemsHint items={data[characterId].items} />
                        </dd>
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
                let key = item.character.name;
                const isMain = typeof(settings.altMap[key]) === 'undefined';
                if (!isMain) {
                    key = settings.altMap[key];
                }
                if (typeof(result[key]) === 'undefined') {
                    result[key] = {
                        character: item.character,
                        volume: 0,
                        share: 0,
                        items: {},
                    };
                }
                if (isMain) {
                    // Push main character info
                    result[key].character = item.character;
                }

                if (typeof(result[key].items[item.typeId]) === 'undefined') {
                    // push items (grouped)
                    result[key].items[item.typeId] = {
                        typeId: item.typeId,
                        quantity: 0,
                        type: item.type
                    };
                }
                result[key].items[item.typeId].quantity += item.quantity;

                if (typeof(totalQuantities[item.typeId]) === 'undefined') {
                    totalQuantities[item.typeId] = { quantity: 0, volume: 0, type: item.type };
                }
                totalQuantities[item.typeId].quantity += item.quantity;
                totalQuantities[item.typeId].volume += item.quantity * item.type.volume;
                if (settings.shareableMarketGroups.indexOf(item.type.marketGroup.name) >= 0) {
                    totalVolume += item.quantity * item.type.volume;
                    result[key].volume += item.quantity * item.type.volume;
                }
            });
            Object.keys(result).map(characterId => {
                result[characterId].volume *= settings.transportPayModifier;
                if (totalVolume > 0) {
                    result[characterId].share = (100 * result[characterId].volume / totalVolume).toFixed(3);
                } else {
                    result[characterId].share = 0;
                }
            })
            console.log(result);
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
