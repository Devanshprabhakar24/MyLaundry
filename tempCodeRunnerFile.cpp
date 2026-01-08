#include <iostream>
#include <vector>
#include <algorithm>
#include <map>
#include <utility>
using namespace std;

class DSU {
    vector<int> parent;
    vector<int> max1;
public:
    DSU(int n) {
        parent.resize(n+1);
        max1.resize(n+1);
        for (int i=1;i<=n;++i) {
            parent[i]=i;
            max1[i]=i;
        }
    }
    int find(int x) {
        return parent[x]==x ? x : parent[x]=find(parent[x]);
    }
    void unite(int a,int b){
        int ra=find(a), rb=find(b);
        if(ra==rb) return;
        parent[rb]=ra;
        max1[ra]=max(max1[ra],max1[rb]);
    }
    int getLargestInComponent(int x){
        return max1[find(x)];
    }
    vector<int> getLargestPerComponent(){
        vector<int> largest;
        for(int i=1;i<parent.size();++i){
            if(parent[i]==i) largest.push_back(max1[i]);
        }
        return largest;
    }
};

long long largestPartnerClusterProduct(
    int partnerCount,
    const vector<int>& restaurantFrom,
    const vector<int>& restaurantTo,
    const vector<int>& restaurantIds)
{
    map<int, vector<pair<int,int>>> grouped;
    for(size_t i=0;i<restaurantFrom.size();++i){
        grouped[restaurantIds[i]].push_back({restaurantFrom[i],restaurantTo[i]});
    }

    vector<int> largestEachRestaurant;

    for(auto &it: grouped){
        DSU dsu(partnerCount);
        for(auto &edge: it.second){
            dsu.unite(edge.first,edge.second);
        }
        // Get largest cluster ID in this restaurant
        vector<int> comps = dsu.getLargestPerComponent();
        int largestInRestaurant = *max_element(comps.begin(), comps.end());
        largestEachRestaurant.push_back(largestInRestaurant);
    }

    if(largestEachRestaurant.size()<2) return 0;

    sort(largestEachRestaurant.rbegin(), largestEachRestaurant.rend());
    return (long long)largestEachRestaurant[0] * largestEachRestaurant[1];
}

int main(){
    int partnerCount,n;
    cin>>partnerCount>>n;
    vector<int> from(n),to(n),ids(n);
    for(int i=0;i<n;++i) cin>>from[i];
    for(int i=0;i<n;++i) cin>>to[i];
    for(int i=0;i<n;++i) cin>>ids[i];

    cout<<largestPartnerClusterProduct(partnerCount,from,to,ids)<<endl;
    return 0;
}
