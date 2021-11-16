import { useQuery } from '@apollo/client';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import { GQLGetCorporationMiningObserverEntries } from '../GraphQLClient';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import CEditableTextField from './CEditableTextField';

import settings from '../settings.js'
export default function MiningOpsView ()
{
    const params = new URLSearchParams(window.location.search);
    const corporationId = params.get('corporationId');
    const observerId = params.get('observerId');
    const to = params.get('date');
    let realQuantities = [];

    let from = (new Date(Date.parse(to) - 5 * 24 * 60 * 60 * 1000))
        .toISOString().split('T')[0];

    const { loading, error, data } = useQuery(GQLGetCorporationMiningObserverEntries,  { variables: { corporationId, observerId, dateRange: { from, to } }});

    function ItemsHint({items})
    {
        let totalVolume = 0,
            totalQuantity = 0;

        return (
            <>
                <span class="icon"><AddIcon /></span>
                <span class="icon showMore"><MoreIcon /></span>
                <span class="hint">
                    <dl>
                        <dt>Name</dt>
                        <dd>Quantity</dd>
                        {Object.keys(items).map(itemId => {
                            totalVolume += items[itemId].quantity * items[itemId].type.volume;
                            totalQuantity += items[itemId].quantity;
                            return (<>
                                <dt>{items[itemId].type.name} ({items[itemId].type.id})</dt>
                                <dd>{items[itemId].quantity} ({items[itemId].quantity * items[itemId].type.volume} m3)</dd>
                            </>)
                        })}
                        <dt class="totals"><b>Total</b></dt>
                        <dd class="totals"><b>{totalQuantity} ({totalVolume} m3)</b></dd>
                    </dl>
                </span>
            </>
        )
    }

    function List({data}) {
        if (!data) {
            return '';
        }
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

    function TotalsRefined({data})
    {
        if (!data) {
            return '';
        }
        return(<dl>
                <dt>Moon material</dt>
                <dd>Quantity</dd>
            {data.map(item => (<>
                <dt>{item.type.name}</dt>
                <dd>{item.quantity}</dd>
            </>))}
        </dl>)
    }

    function SetRealValue(item, value)
    {
        item.realQuantity = value;
    }

    function Totals({data})
    {
        if (!data) {
            return '';
        }
//        console.log(data);
        return(<>
            <dl>
                <dt>Name</dt>
                <dd>Quantity</dd>
            {data.map(item => (
                <>
                    <dt>{item.type.name}</dt>
                    <dd><CEditableTextField bind={item} initialField="quantity" bindField="realQuantity" setValue={SetRealValue} />{item.quantity} ({(typeof(item.realQuantity)==='undefined' ? item.quantity : item.realQuantity ) * item.type.volume} m3)</dd>
                </>
            ))}
            </dl>
        </>);
    }

    function RetrieveMiningOpView()
    {
        if (loading) return [];
        if (error) return [];
        if (data && data.getCorporationMiningObserverEntries) {
            let result = {},
                totalVolume = 0,
                totalQuantities = [],
                totalRefineQuantities = [];

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
                    totalQuantities[item.typeId] = { quantity: 0, volume: 0, type: item.type, refine: item.refine };
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
            });
            Object.keys(totalQuantities).map(itemId => {
                let item = totalQuantities[itemId];
                let refinedCount = Math.floor(item.quantity / item.type.portionSize);
                item.refine.forEach((ref) => {
                    if (typeof(totalRefineQuantities[ref.type.id]) === 'undefined') {
                        totalRefineQuantities[ref.type.id] = {
                            quantity: 0,
                            type: ref.type
                        }
                    }
                    totalRefineQuantities[ref.type.id].quantity += Math.floor(ref.quantity * refinedCount * settings.reprocessingAmount/100);
                });
            });
            return {
                characters: result,
                totals: totalQuantities,
                totalsRefined: totalRefineQuantities,
                totalVolume: totalVolume,
            };
        }
        return [];
    }
    let op = RetrieveMiningOpView();
//    console.log(op);
    realQuantities = op.totals;
    return (
        <>
        <List data = {op.characters} />
        <Totals data = {realQuantities} />
        <TotalsRefined data = {op.totalsRefined} />
        </>
    );
}
