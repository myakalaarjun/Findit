// Node 18+ has built-in fetch
const BASE_URL = 'http://localhost:5000/api';

async function testApi() {
  console.log('Testing ReLoop Backend API...');

  // 1. Health
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log('1. Health check:', healthData.status === 'ok' ? 'PASS' : 'FAIL', healthData);

  // 2. Create Lost Item
  const item1Res = await fetch(`${BASE_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'lost',
      title: 'Navy Leather Wallet',
      description: 'Lost near Central Library with transit card inside',
      category: 'Accessories & Wallets',
      location: 'Central Library',
      eventDate: '2026-10-08',
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80',
    }),
  });
  const item1Data = await item1Res.json();
  console.log('2. Create Lost Item:', item1Res.status === 201 ? 'PASS' : 'FAIL', item1Data.data?._id);

  // 3. Create Found Item
  const item2Res = await fetch(`${BASE_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'found',
      title: 'Silver Sony Headphones',
      description: 'Found on bench near city park fountain',
      category: 'Electronics',
      location: 'City Park West',
      eventDate: '2026-10-09',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    }),
  });
  const item2Data = await item2Res.json();
  console.log('3. Create Found Item:', item2Res.status === 201 ? 'PASS' : 'FAIL', item2Data.data?._id);

  // 4. Get items & search
  const searchRes = await fetch(`${BASE_URL}/items?search=wallet`);
  const searchData = await searchRes.json();
  console.log('4. Search items by keyword:', searchData.count >= 1 ? 'PASS' : 'FAIL', `count=${searchData.count}`);

  // 5. Update item status (e.g. mark returned)
  const patchItemRes = await fetch(`${BASE_URL}/items/${item1Data.data._id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Returned' }),
  });
  const patchItemData = await patchItemRes.json();
  console.log('5. Update item status:', patchItemData.data?.status === 'Returned' ? 'PASS' : 'FAIL');

  // 6. Create Marketplace Listing 1
  const list1Res = await fetch(`${BASE_URL}/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Vintage Solid Oak Desk',
      description: 'Sturdy oak writing desk with 3 pull-out drawers. Excellent condition.',
      price: 2500,
      category: 'Furniture & Home',
      condition: 'Good Condition',
      location: 'Downtown Center',
      sellerContact: 'phone: 555-0199',
      imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80',
    }),
  });
  const list1Data = await list1Res.json();
  console.log('6. Create Listing 1:', list1Res.status === 201 ? 'PASS' : 'FAIL', list1Data.data?._id);

  // 7. Create Marketplace Listing 2
  const list2Res = await fetch(`${BASE_URL}/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Trek Mountain Bicycle 21-Speed',
      description: 'Well-maintained mountain bike, recent tune-up with disc brakes.',
      price: 8500,
      category: 'Bicycles & Transport',
      condition: 'Like New',
      location: 'Northside Park',
      sellerContact: 'email: rider@example.com',
      imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&q=80',
    }),
  });
  const list2Data = await list2Res.json();
  console.log('7. Create Listing 2:', list2Res.status === 201 ? 'PASS' : 'FAIL', list2Data.data?._id);

  // 8. Query listings with sort by price
  const sortRes = await fetch(`${BASE_URL}/listings?sort=price_asc`);
  const sortData = await sortRes.json();
  const pricesAsc = sortData.data?.map(l => l.price);
  console.log('8. Sort listings by price_asc:', pricesAsc[0] <= pricesAsc[1] ? 'PASS' : 'FAIL', pricesAsc);

  // 9. Mark listing as sold
  const soldRes = await fetch(`${BASE_URL}/listings/${list1Data.data._id}/sold`, {
    method: 'POST',
  });
  const soldData = await soldRes.json();
  console.log('9. Mark listing as Sold:', soldData.data?.status === 'sold' ? 'PASS' : 'FAIL');

  // 10. Moderation report
  const modRes = await fetch(`${BASE_URL}/moderation/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      listing: list2Data.data._id,
      reason: 'Questionable pricing details, requesting review.',
    }),
  });
  const modData = await modRes.json();
  console.log('10. Create Moderation report:', modRes.status === 201 ? 'PASS' : 'FAIL', modData.data?._id);

  // 11. Admin view reports
  const adminRes = await fetch(`${BASE_URL}/admin/reports`);
  const adminData = await adminRes.json();
  console.log('11. Admin get reports with populated listing:', adminData.count >= 1 && adminData.data[0].listing ? 'PASS' : 'FAIL');

  // 12. Admin update report
  const adminPatchRes = await fetch(`${BASE_URL}/admin/reports/${modData.data._id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'resolved' }),
  });
  const adminPatchData = await adminPatchRes.json();
  console.log('12. Admin resolve report:', adminPatchData.data?.status === 'resolved' ? 'PASS' : 'FAIL');

  console.log('\nAll Backend API tests completed!');
}

testApi().catch(console.error);
