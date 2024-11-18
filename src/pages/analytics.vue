<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Shopping Analytics</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Spending Trends -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Monthly Spending Trends</h2>
        <Line
          v-if="spendingData.datasets"
          :data="spendingData"
          :options="chartOptions"
        />
      </div>

      <!-- Most Purchased Items -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Most Purchased Items</h2>
        <Bar
          v-if="itemsData.datasets"
          :data="itemsData"
          :options="chartOptions"
        />
      </div>

      <!-- Shopping Statistics -->
      <div class="bg-white p-6 rounded-lg shadow col-span-full">
        <h2 class="text-lg font-semibold mb-4">Shopping Statistics</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Average Spend per List</p>
            <p class="text-2xl font-bold text-indigo-600">{{ formatCurrency(statistics.averageSpend) }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Total Lists Created</p>
            <p class="text-2xl font-bold text-indigo-600">{{ statistics.totalLists }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Most Common Item</p>
            <p class="text-2xl font-bold text-indigo-600">{{ statistics.mostCommonItem || 'N/A' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const spendingData = ref({
  labels: [],
  datasets: []
})

const itemsData = ref({
  labels: [],
  datasets: []
})

const statistics = ref({
  averageSpend: 0,
  totalLists: 0,
  mostCommonItem: null
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

onMounted(async () => {
  const { $db } = useNuxtApp()
  const { user } = useAuth()

  if (!user.value) return

  // Fetch completed shopping lists
  const q = query(
    collection($db, 'shoppingLists'),
    where('userId', '==', user.value.uid),
    where('completed', '==', true)
  )

  const querySnapshot = await getDocs(q)
  const lists = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))

  // Process data for spending trends
  const spendingByMonth = {}
  const itemFrequency = {}
  let totalSpend = 0

  lists.forEach(list => {
    const date = list.completedAt.toDate()
    const monthYear = format(date, 'MMM yyyy')
    
    spendingByMonth[monthYear] = (spendingByMonth[monthYear] || 0) + list.totalAmount
    totalSpend += list.totalAmount

    // Process items frequency
    list.items.forEach(item => {
      itemFrequency[item.name] = (itemFrequency[item.name] || 0) + 1
    })
  })

  // Update spending trends chart
  spendingData.value = {
    labels: Object.keys(spendingByMonth),
    datasets: [{
      label: 'Monthly Spending',
      data: Object.values(spendingByMonth),
      borderColor: 'rgb(79, 70, 229)',
      tension: 0.1
    }]
  }

  // Update items frequency chart
  const sortedItems = Object.entries(itemFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)

  itemsData.value = {
    labels: sortedItems.map(([name]) => name),
    datasets: [{
      label: 'Purchase Frequency',
      data: sortedItems.map(([,count]) => count),
      backgroundColor: 'rgba(79, 70, 229, 0.5)'
    }]
  }

  // Update statistics
  statistics.value = {
    averageSpend: totalSpend / lists.length,
    totalLists: lists.length,
    mostCommonItem: sortedItems[0]?.[0]
  }
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}
</script>