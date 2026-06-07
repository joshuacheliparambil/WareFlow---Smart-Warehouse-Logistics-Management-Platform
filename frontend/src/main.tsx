import React from "react";
import ReactDOM from "react-dom/client";
import {
  Activity,
  AlertTriangle,
  ArrowDownUp,
  Boxes,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock3,
  Database,
  Gauge,
  PackagePlus,
  PackageSearch,
  Radar,
  RotateCcw,
  ShieldCheck,
  Truck,
  Users,
  Zap
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import "./index.css";

type View = "Dashboard" | "Inventory" | "Orders" | "Deliveries" | "Risk Radar" | "Analytics" | "Users/Roles" | "System Events";
type Warehouse = "All warehouses" | "North Hub" | "South Hub" | "East Hub" | "West Hub" | "Central Hub";
type Tenant = "US tenant" | "EU tenant";
type Portal = "TMS Portal" | "Customer Portal";
type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type OrderStatus = "Created" | "Picking" | "Dispatched" | "Delivered" | "Cancelled" | "Returned" | "Failed";
type DeliveryStatus = "Assigned" | "In transit" | "Delayed" | "Delivered";

type Product = {
  sku: string;
  name: string;
  category: string;
  hub: Exclude<Warehouse, "All warehouses">;
  stock: number;
  reorderPoint: number;
  dailySales: number;
  damaged: number;
  batch: string;
  expiry: string;
  price: number;
};

type Order = {
  id: string;
  sku: string;
  product: string;
  hub: Exclude<Warehouse, "All warehouses">;
  region: string;
  quantity: number;
  status: OrderStatus;
  revenue: number;
  returnReason?: string;
  failedReason?: string;
};

type Delivery = {
  id: string;
  orderId: string;
  hub: Exclude<Warehouse, "All warehouses">;
  agent: string;
  region: string;
  status: DeliveryStatus;
  eta: string;
  onTimeRate: number;
};

type Agent = {
  name: string;
  role: "DELIVERY_AGENT";
  hub: Exclude<Warehouse, "All warehouses">;
  onTimeRate: number;
  active: number;
  rating: number;
};

type Risk = {
  id: string;
  title: string;
  severity: Severity;
  score: number;
  reason: string;
  action: string;
  entity: string;
  hub: Exclude<Warehouse, "All warehouses">;
};

type NavItem = { label: View; icon: React.ComponentType<{ size?: number; className?: string }> };

const warehouses: Warehouse[] = ["All warehouses", "North Hub", "South Hub", "East Hub", "West Hub", "Central Hub"];
const tenants: Tenant[] = ["US tenant", "EU tenant"];
const portals: Portal[] = ["TMS Portal", "Customer Portal"];

const navItems: NavItem[] = [
  { label: "Dashboard", icon: Activity },
  { label: "Inventory", icon: PackageSearch },
  { label: "Orders", icon: Boxes },
  { label: "Deliveries", icon: Truck },
  { label: "Risk Radar", icon: AlertTriangle },
  { label: "Analytics", icon: ChartNoAxesCombined },
  { label: "Users/Roles", icon: Users },
  { label: "System Events", icon: Clock3 }
];

const initialProducts: Product[] = [
  { sku: "WF-SKU-0015", name: "iPhone 15", category: "Phones", hub: "North Hub", stock: 119, reorderPoint: 150, dailySales: 42, damaged: 3, batch: "N-26-15A", expiry: "2027-04-18", price: 799 },
  { sku: "WF-SKU-0031", name: "ThinkPad X1 Carbon", category: "Laptops", hub: "Central Hub", stock: 482, reorderPoint: 90, dailySales: 17, damaged: 1, batch: "C-26-31T", expiry: "2028-01-10", price: 1399 },
  { sku: "WF-SKU-0044", name: "Air Fryer Pro", category: "Home", hub: "West Hub", stock: 37, reorderPoint: 110, dailySales: 29, damaged: 12, batch: "W-26-44H", expiry: "2027-08-01", price: 179 },
  { sku: "WF-SKU-0072", name: "Running Shoes", category: "Fashion", hub: "South Hub", stock: 268, reorderPoint: 120, dailySales: 33, damaged: 8, batch: "S-26-72F", expiry: "2029-05-11", price: 129 },
  { sku: "WF-SKU-0099", name: "Noise Buds X", category: "Electronics", hub: "East Hub", stock: 88, reorderPoint: 100, dailySales: 26, damaged: 2, batch: "E-26-99E", expiry: "2028-10-21", price: 89 },
  { sku: "WF-SKU-0104", name: "Protein Pack 2kg", category: "Grocery", hub: "North Hub", stock: 64, reorderPoint: 85, dailySales: 18, damaged: 0, batch: "N-26-104G", expiry: "2026-12-19", price: 59 },
  { sku: "WF-SKU-0118", name: "Office Chair Ergo", category: "Home", hub: "West Hub", stock: 321, reorderPoint: 80, dailySales: 11, damaged: 5, batch: "W-26-118H", expiry: "2029-02-02", price: 249 },
  { sku: "WF-SKU-0122", name: "Galaxy S24", category: "Phones", hub: "Central Hub", stock: 142, reorderPoint: 130, dailySales: 39, damaged: 2, batch: "C-26-122P", expiry: "2028-03-04", price: 749 },
  { sku: "WF-SKU-0140", name: "Espresso Machine", category: "Home", hub: "East Hub", stock: 54, reorderPoint: 70, dailySales: 15, damaged: 4, batch: "E-26-140H", expiry: "2027-11-13", price: 329 },
  { sku: "WF-SKU-0156", name: "Hoodie Core", category: "Fashion", hub: "South Hub", stock: 92, reorderPoint: 160, dailySales: 22, damaged: 17, batch: "S-26-156F", expiry: "2029-09-09", price: 79 }
];

const initialOrders: Order[] = [
  { id: "WF-88231", sku: "WF-SKU-0015", product: "iPhone 15", hub: "North Hub", region: "Delhi NCR", quantity: 4, status: "Picking", revenue: 3196 },
  { id: "WF-88232", sku: "WF-SKU-0044", product: "Air Fryer Pro", hub: "West Hub", region: "Mumbai", quantity: 12, status: "Failed", revenue: 0, failedReason: "Insufficient stock after damaged batch hold" },
  { id: "WF-88233", sku: "WF-SKU-0031", product: "ThinkPad X1 Carbon", hub: "Central Hub", region: "Bengaluru", quantity: 2, status: "Delivered", revenue: 2798 },
  { id: "WF-88234", sku: "WF-SKU-0072", product: "Running Shoes", hub: "South Hub", region: "Hyderabad", quantity: 9, status: "Returned", revenue: 1161, returnReason: "Wrong size cluster" },
  { id: "WF-88235", sku: "WF-SKU-0099", product: "Noise Buds X", hub: "East Hub", region: "Kolkata", quantity: 18, status: "Dispatched", revenue: 1602 },
  { id: "WF-88236", sku: "WF-SKU-0122", product: "Galaxy S24", hub: "Central Hub", region: "Pune", quantity: 6, status: "Created", revenue: 4494 },
  { id: "WF-88237", sku: "WF-SKU-0156", product: "Hoodie Core", hub: "South Hub", region: "Chennai", quantity: 21, status: "Returned", revenue: 1659, returnReason: "Fabric issue reported by customers" },
  { id: "WF-88238", sku: "WF-SKU-0140", product: "Espresso Machine", hub: "East Hub", region: "Ahmedabad", quantity: 3, status: "Delivered", revenue: 987 }
];

const initialAgents: Agent[] = [
  { name: "Agent 08", role: "DELIVERY_AGENT", hub: "West Hub", onTimeRate: 78, active: 14, rating: 4.1 },
  { name: "Agent 14", role: "DELIVERY_AGENT", hub: "North Hub", onTimeRate: 94, active: 8, rating: 4.8 },
  { name: "Agent 22", role: "DELIVERY_AGENT", hub: "Central Hub", onTimeRate: 89, active: 11, rating: 4.5 },
  { name: "Agent 31", role: "DELIVERY_AGENT", hub: "South Hub", onTimeRate: 83, active: 15, rating: 4.0 },
  { name: "Agent 44", role: "DELIVERY_AGENT", hub: "East Hub", onTimeRate: 91, active: 7, rating: 4.7 }
];

const initialDeliveries: Delivery[] = [
  { id: "DL-1912", orderId: "WF-88231", hub: "North Hub", agent: "Agent 14", region: "Delhi NCR", status: "In transit", eta: "Today 18:40", onTimeRate: 94 },
  { id: "DL-1913", orderId: "WF-88232", hub: "West Hub", agent: "Agent 08", region: "Mumbai", status: "Delayed", eta: "Tomorrow 11:20", onTimeRate: 78 },
  { id: "DL-1914", orderId: "WF-88233", hub: "Central Hub", agent: "Agent 22", region: "Bengaluru", status: "Delivered", eta: "Delivered 09:10", onTimeRate: 89 },
  { id: "DL-1915", orderId: "WF-88234", hub: "South Hub", agent: "Agent 31", region: "Hyderabad", status: "Delayed", eta: "Today 23:10", onTimeRate: 83 },
  { id: "DL-1916", orderId: "WF-88235", hub: "East Hub", agent: "Agent 44", region: "Kolkata", status: "Assigned", eta: "Today 21:00", onTimeRate: 91 }
];

const users = [
  { name: "Avery Admin", email: "admin@wareflow.dev", role: "ADMIN", scope: "Full platform control" },
  { name: "Mira Manager", email: "manager@wareflow.dev", role: "WAREHOUSE_MANAGER", scope: "Inventory, orders, deliveries" },
  { name: "Anika Analyst", email: "analyst@wareflow.dev", role: "ANALYST", scope: "Analytics and Risk Radar" },
  { name: "Dev Delivery", email: "agent@wareflow.dev", role: "DELIVERY_AGENT", scope: "Delivery status updates" }
];

function seedRisks(products: Product[], orders: Order[], deliveries: Delivery[], agents: Agent[]) {
  const risks: Risk[] = [];
  products.forEach((product) => {
    const daysLeft = product.stock / Math.max(product.dailySales, 1);
    if (daysLeft < 5 || product.stock < product.reorderPoint) {
      risks.push({
        id: `risk-${product.sku}`,
        title: `${product.name} may stock out in ${Math.max(1, Math.ceil(daysLeft))} days`,
        severity: daysLeft < 2 ? "CRITICAL" : daysLeft < 4 ? "HIGH" : "MEDIUM",
        score: Math.min(98, Math.round(100 - daysLeft * 8 + product.damaged)),
        reason: `Average daily sales = ${product.dailySales}, current stock = ${product.stock}, reorder point = ${product.reorderPoint}`,
        action: `Restock minimum ${Math.max(product.reorderPoint * 3, product.dailySales * 10)} units`,
        entity: product.sku,
        hub: product.hub
      });
    }
    if (product.damaged > 10) {
      risks.push({
        id: `damage-${product.sku}`,
        title: `${product.name} has abnormal damaged-item volume`,
        severity: "HIGH",
        score: Math.min(92, 65 + product.damaged),
        reason: `${product.damaged} damaged units are quarantined in batch ${product.batch}`,
        action: "Block outbound pick list for this batch and run QC audit",
        entity: product.batch,
        hub: product.hub
      });
    }
  });

  const returnedByHub = new Map<string, number>();
  orders.filter((order) => order.status === "Returned").forEach((order) => returnedByHub.set(order.hub, (returnedByHub.get(order.hub) ?? 0) + 1));
  returnedByHub.forEach((count, hub) => {
    if (count >= 1) {
      risks.push({
        id: `return-${hub}`,
        title: `${hub} has repeated return signals`,
        severity: count > 1 ? "HIGH" : "MEDIUM",
        score: 62 + count * 11,
        reason: `${count} return cluster found in the current operating sample`,
        action: "Review product-batch quality and customer issue tags before next dispatch",
        entity: hub,
        hub: hub as Exclude<Warehouse, "All warehouses">
      });
    }
  });

  deliveries.filter((delivery) => delivery.status === "Delayed").forEach((delivery) => {
    risks.push({
      id: `delay-${delivery.id}`,
      title: `${delivery.region} route is likely to breach SLA`,
      severity: delivery.onTimeRate < 82 ? "HIGH" : "MEDIUM",
      score: 100 - delivery.onTimeRate + 55,
      reason: `${delivery.agent} on-time rate = ${delivery.onTimeRate}%, ETA = ${delivery.eta}`,
      action: "Reassign heavy stops and send customer ETA notification",
      entity: delivery.id,
      hub: delivery.hub
    });
  });

  agents.filter((agent) => agent.onTimeRate < 86 || agent.active > 13).forEach((agent) => {
    risks.push({
      id: `agent-${agent.name}`,
      title: `${agent.name} has declining delivery performance`,
      severity: agent.onTimeRate < 80 ? "HIGH" : "MEDIUM",
      score: Math.min(90, 100 - agent.onTimeRate + agent.active * 3),
      reason: `On-time rate = ${agent.onTimeRate}%, active deliveries = ${agent.active}, rating = ${agent.rating}`,
      action: "Reduce route load and audit delayed route clusters",
      entity: agent.name,
      hub: agent.hub
    });
  });

  return risks.sort((a, b) => b.score - a.score);
}

function severityClass(severity: Severity) {
  return {
    LOW: "bg-sky/15 text-sky border-sky/30",
    MEDIUM: "bg-amber/15 text-amber border-amber/30",
    HIGH: "bg-coral/15 text-coral border-coral/30",
    CRITICAL: "bg-red-500/20 text-red-200 border-red-400/40"
  }[severity];
}

function statusClass(status: string) {
  if (["Delivered", "Healthy", "Resolved"].includes(status)) return "bg-mint/10 text-mint";
  if (["Delayed", "Failed", "Critical", "Returned"].includes(status)) return "bg-coral/10 text-coral";
  if (["Low", "Picking", "In transit", "Assigned"].includes(status)) return "bg-amber/10 text-amber";
  return "bg-sky/10 text-sky";
}

function money(value: number, currency = "USD") {
  return new Intl.NumberFormat(currency === "EUR" ? "de-DE" : "en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

function App() {
  const params = new URLSearchParams(window.location.search);
  const initialView = navItems.some((item) => item.label === params.get("view")) ? params.get("view") as View : "Dashboard";
  const initialWarehouse = warehouses.includes(params.get("warehouse") as Warehouse) ? params.get("warehouse") as Warehouse : "All warehouses";
  const initialTenant = tenants.includes(params.get("tenant") as Tenant) ? params.get("tenant") as Tenant : "US tenant";
  const initialPortal = portals.includes(params.get("portal") as Portal) ? params.get("portal") as Portal : "TMS Portal";
  const [activeView, setActiveView] = React.useState<View>(initialView);
  const [warehouse, setWarehouse] = React.useState<Warehouse>(initialWarehouse);
  const [tenant, setTenant] = React.useState<Tenant>(initialTenant);
  const [portal, setPortal] = React.useState<Portal>(initialPortal);
  const [query, setQuery] = React.useState("");
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [orders, setOrders] = React.useState<Order[]>(initialOrders);
  const [deliveries, setDeliveries] = React.useState<Delivery[]>(initialDeliveries);
  const [events, setEvents] = React.useState<string[]>([
    "RISK_DETECTED WF-SKU-0044 stockout probability crossed 90",
    "LOW_STOCK_TRIGGERED WF-SKU-0015 reorder point breached",
    "DELIVERY_ASSIGNED WF-88231 to Agent 14",
    "ORDER_CREATED WF-88236 from Pune region",
    "INVENTORY_UPDATED WF-SKU-0099 outbound 18 units"
  ]);
  const [radarVersion, setRadarVersion] = React.useState(1);

  const scopedProducts = React.useMemo(
    () => products.filter((product) => warehouse === "All warehouses" || product.hub === warehouse),
    [products, warehouse]
  );
  const scopedOrders = React.useMemo(
    () => orders.filter((order) => warehouse === "All warehouses" || order.hub === warehouse),
    [orders, warehouse]
  );
  const scopedDeliveries = React.useMemo(
    () => deliveries.filter((delivery) => warehouse === "All warehouses" || delivery.hub === warehouse),
    [deliveries, warehouse]
  );
  const risks = React.useMemo(() => {
    const base = seedRisks(products, orders, deliveries, initialAgents);
    return base
      .filter((risk) => warehouse === "All warehouses" || risk.hub === warehouse)
      .map((risk, index) => ({ ...risk, score: Math.min(99, risk.score + (radarVersion % 3) + (index % 2)) }));
  }, [products, orders, deliveries, radarVersion, warehouse]);

  const filteredProducts = scopedProducts.filter((product) => `${product.sku} ${product.name} ${product.category} ${product.hub}`.toLowerCase().includes(query.toLowerCase()));
  const totalRevenue = scopedOrders.reduce((sum, order) => sum + order.revenue, 0);
  const currency = tenant === "EU tenant" ? "EUR" : "USD";
  const regionLabel = tenant === "EU tenant" ? "EuroFreight GmbH - EUR, metric, Europe/Berlin" : "Default Logistics - USD, imperial, America/Chicago";
  const returnRate = scopedOrders.length ? (scopedOrders.filter((order) => order.status === "Returned").length / scopedOrders.length) * 100 : 0;
  const fulfillmentRate = scopedOrders.length ? (scopedOrders.filter((order) => !["Failed", "Cancelled"].includes(order.status)).length / scopedOrders.length) * 100 : 0;
  const delayedCount = scopedDeliveries.filter((delivery) => delivery.status === "Delayed").length;
  const utilization = warehouse === "West Hub" ? 91 : warehouse === "North Hub" ? 84 : warehouse === "Central Hub" ? 79 : warehouse === "East Hub" ? 76 : warehouse === "South Hub" ? 72 : 81;

  const weeklyData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => ({
    day,
    orders: scopedOrders.length * 24 + index * 18 + (warehouse === "West Hub" ? 35 : 0),
    returns: Math.round(returnRate + index * 2 + (warehouse === "South Hub" ? 8 : 0))
  }));

  const utilizationData = warehouses.slice(1).map((hub) => ({
    hub: hub.replace(" Hub", ""),
    usage: hub === "West Hub" ? 91 : hub === "North Hub" ? 84 : hub === "Central Hub" ? 79 : hub === "East Hub" ? 76 : 72
  }));

  function pushEvent(event: string) {
    setEvents((current) => [`${new Date().toLocaleTimeString()} ${event}`, ...current].slice(0, 14));
  }

  function refreshRadar() {
    setRadarVersion((version) => version + 1);
    const pressureProduct = scopedProducts.sort((a, b) => a.stock / a.dailySales - b.stock / b.dailySales)[0];
    if (pressureProduct) {
      pushEvent(`RISK_DETECTED ${pressureProduct.sku} recomputed from live operating state`);
    }
  }

  function simulateOrder() {
    const product = scopedProducts[0] ?? products[0];
    const quantity = Math.min(5, Math.max(1, Math.floor(product.stock / 20)));
    setProducts((current) => current.map((item) => item.sku === product.sku ? { ...item, stock: Math.max(0, item.stock - quantity), dailySales: item.dailySales + 1 } : item));
    const id = `WF-${Math.floor(89000 + Math.random() * 999)}`;
    setOrders((current) => [{ id, sku: product.sku, product: product.name, hub: product.hub, region: "Live Simulation", quantity, status: "Created", revenue: quantity * product.price }, ...current]);
    pushEvent(`ORDER_CREATED ${id} deducted ${quantity} units from ${product.sku}`);
  }

  function receiveStock() {
    const product = scopedProducts.sort((a, b) => a.stock - b.stock)[0] ?? products[0];
    setProducts((current) => current.map((item) => item.sku === product.sku ? { ...item, stock: item.stock + item.reorderPoint * 2 } : item));
    pushEvent(`INVENTORY_UPDATED ${product.sku} inbound ${product.reorderPoint * 2} units`);
  }

  function assignDelivery() {
    const order = scopedOrders.find((item) => ["Created", "Picking"].includes(item.status)) ?? scopedOrders[0] ?? orders[0];
    const agent = initialAgents.find((item) => item.hub === order.hub) ?? initialAgents[0];
    const deliveryId = `DL-${Math.floor(2000 + Math.random() * 900)}`;
    setDeliveries((current) => [{ id: deliveryId, orderId: order.id, hub: order.hub, agent: agent.name, region: order.region, status: "Assigned", eta: "Today 20:30", onTimeRate: agent.onTimeRate }, ...current]);
    setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: "Dispatched" } : item));
    pushEvent(`DELIVERY_ASSIGNED ${order.id} to ${agent.name}`);
  }

  function runAutopilot() {
    const topRisk = risks[0];
    if (topRisk?.title.includes("stock out") || topRisk?.title.includes("stock")) {
      receiveStock();
    }
    assignDelivery();
    setRadarVersion((version) => version + 2);
    pushEvent(`AUTOPILOT_DECISION approved plan for ${topRisk?.entity ?? "current operating window"}`);
  }

  function resetDemo() {
    setProducts(initialProducts);
    setOrders(initialOrders);
    setDeliveries(initialDeliveries);
    setRadarVersion(1);
    setEvents(["RESET_DEMO_DATA restored local synthetic operating dataset"]);
  }

  const metricCards = [
    { label: "Orders", value: String(scopedOrders.length), meta: `${scopedOrders.filter((order) => order.status === "Created").length} new`, icon: Boxes },
    { label: "Revenue", value: money(totalRevenue, currency), meta: `${returnRate.toFixed(1)}% returns`, icon: ChartNoAxesCombined },
    { label: "Fulfillment", value: `${fulfillmentRate.toFixed(1)}%`, meta: `${scopedOrders.filter((order) => order.status === "Failed").length} failed`, icon: ShieldCheck },
    { label: "Utilization", value: `${utilization}%`, meta: utilization > 85 ? "Capacity risk" : "Stable", icon: Gauge }
  ];

  return (
    <div className="min-h-screen text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r border-line bg-ink/95 px-4 py-5 backdrop-blur lg:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded bg-mint text-ink">
            <Radar size={22} />
          </div>
          <div>
            <div className="text-lg font-semibold">WareFlow</div>
            <div className="text-xs text-slate-400">Operations Command</div>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} onClick={() => setActiveView(label)} className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm ${activeView === label ? "bg-mint text-ink font-semibold" : "text-slate-300 hover:bg-white/5"}`}>
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-line bg-ink/80 px-5 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">{activeView}</h1>
              <p className="text-sm text-slate-400">{portal} / {regionLabel} / {warehouse} scope.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select value={portal} onChange={(event) => setPortal(event.target.value as Portal)} className="rounded border border-line bg-panel px-3 py-2 text-sm text-slate-200">
                {portals.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={tenant} onChange={(event) => setTenant(event.target.value as Tenant)} className="rounded border border-line bg-panel px-3 py-2 text-sm text-slate-200">
                {tenants.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={warehouse} onChange={(event) => setWarehouse(event.target.value as Warehouse)} className="rounded border border-line bg-panel px-3 py-2 text-sm text-slate-200">
                {warehouses.map((item) => <option key={item}>{item}</option>)}
              </select>
              <button onClick={simulateOrder} className="rounded bg-mint px-3 py-2 text-sm font-semibold text-ink">Create order</button>
              <button onClick={receiveStock} className="rounded border border-line bg-panel px-3 py-2 text-sm text-slate-200">Receive stock</button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-5 px-5 py-6">
          {activeView === "Dashboard" && (
            <>
              <EnterpriseSurface tenant={tenant} portal={portal} setActiveView={setActiveView} runAutopilot={runAutopilot} />

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {metricCards.map(({ label, value, meta, icon: Icon }) => (
                  <div key={label} className="rounded border border-line bg-panel p-4 shadow-2xl shadow-black/10">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-slate-400">{label}</span>
                      <Icon className="text-mint" size={19} />
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <strong className="text-3xl font-semibold">{value}</strong>
                      <span className="rounded border border-mint/25 bg-mint/10 px-2 py-1 text-xs text-mint">{meta}</span>
                    </div>
                  </div>
                ))}
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {navItems.filter((item) => item.label !== "Dashboard").map(({ label, icon: Icon }) => (
                  <button key={label} onClick={() => setActiveView(label)} className="group flex min-h-28 items-center justify-between rounded border border-line bg-panel p-4 text-left hover:border-mint/60 hover:bg-white/[0.04]">
                    <div>
                      <div className="mb-2 text-sm text-slate-400">Open module</div>
                      <div className="font-semibold">{label}</div>
                    </div>
                    <Icon className="text-slate-500 group-hover:text-mint" size={24} />
                  </button>
                ))}
              </section>

              <section className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
                <ChartPanel title="Fulfillment Volume" subtitle="Warehouse filter changes this data">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4fd1a5" stopOpacity={0.55} />
                        <stop offset="95%" stopColor="#4fd1a5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#2a303a" vertical={false} />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: "#171b22", border: "1px solid #2a303a", borderRadius: 6 }} />
                    <Area type="monotone" dataKey="orders" stroke="#4fd1a5" fill="url(#orders)" strokeWidth={2} />
                    <Line type="monotone" dataKey="returns" stroke="#f97373" strokeWidth={2} />
                  </AreaChart>
                </ChartPanel>
                <ChartPanel title="Warehouse Utilization" subtitle={`${utilization}% selected-scope utilization`}>
                  <BarChart data={utilizationData}>
                    <CartesianGrid stroke="#2a303a" vertical={false} />
                    <XAxis dataKey="hub" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: "#171b22", border: "1px solid #2a303a", borderRadius: 6 }} />
                    <Bar dataKey="usage" radius={[4, 4, 0, 0]}>
                      {utilizationData.map((item) => <Cell key={item.hub} fill={item.usage > 85 ? "#f97373" : "#5ab2ff"} />)}
                    </Bar>
                  </BarChart>
                </ChartPanel>
              </section>

              <AutopilotPanel risks={risks.slice(0, 3)} runAutopilot={runAutopilot} />
              <WorkflowPanel simulateOrder={simulateOrder} receiveStock={receiveStock} assignDelivery={assignDelivery} refreshRadar={refreshRadar} />
              <RiskPanel risks={risks.slice(0, 4)} refreshRadar={refreshRadar} />
            </>
          )}

          {activeView === "Inventory" && (
            <Panel title="Inventory Control" subtitle="Search, inspect batch risk, receive stock, and watch low-stock thresholds.">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded border border-line bg-ink px-3 py-2 text-sm text-slate-200 outline-none focus:border-mint md:w-80" placeholder="Search SKU, product, category, hub" />
                <button onClick={receiveStock} className="inline-flex items-center gap-2 rounded bg-mint px-3 py-2 text-sm font-semibold text-ink"><PackagePlus size={17} /> Receive emergency stock</button>
              </div>
              <DataTable headers={["SKU", "Product", "Hub", "Stock", "Reorder", "Daily sales", "Batch", "Status"]}>
                {filteredProducts.map((item) => (
                  <tr key={item.sku}>
                    <td className="py-3 font-mono text-slate-300">{item.sku}</td>
                    <td>{item.name}<div className="text-xs text-slate-500">{item.category}</div></td>
                    <td>{item.hub}</td>
                    <td>{item.stock}</td>
                    <td>{item.reorderPoint}</td>
                    <td>{item.dailySales}</td>
                    <td>{item.batch}</td>
                    <td><Badge label={item.stock < item.reorderPoint ? item.stock < item.reorderPoint / 2 ? "Critical" : "Low" : "Healthy"} /></td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
          )}

          {activeView === "Orders" && (
            <Panel title="Order Management" subtitle="Create simulated orders, track fulfillment, and expose failed fulfillment reasons.">
              <button onClick={simulateOrder} className="mb-4 inline-flex items-center gap-2 rounded bg-mint px-3 py-2 text-sm font-semibold text-ink"><Boxes size={17} /> Create simulated order</button>
              <DataTable headers={["Order", "Product", "Hub", "Region", "Qty", "Revenue", "Status", "Exception"]}>
                {scopedOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 font-mono">{order.id}</td>
                    <td>{order.product}<div className="text-xs text-slate-500">{order.sku}</div></td>
                    <td>{order.hub}</td>
                    <td>{order.region}</td>
                    <td>{order.quantity}</td>
                    <td>{money(order.revenue, currency)}</td>
                    <td><Badge label={order.status} /></td>
                    <td className="max-w-xs text-slate-400">{order.failedReason ?? order.returnReason ?? "None"}</td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
          )}

          {activeView === "Deliveries" && (
            <Panel title="Delivery Command" subtitle="Assign agents, inspect ETA pressure, and identify delayed routes.">
              <button onClick={assignDelivery} className="mb-4 inline-flex items-center gap-2 rounded bg-mint px-3 py-2 text-sm font-semibold text-ink"><Truck size={17} /> Assign next delivery</button>
              <DataTable headers={["Delivery", "Order", "Hub", "Agent", "Region", "ETA", "On-time", "Status"]}>
                {scopedDeliveries.map((delivery) => (
                  <tr key={delivery.id}>
                    <td className="py-3 font-mono">{delivery.id}</td>
                    <td>{delivery.orderId}</td>
                    <td>{delivery.hub}</td>
                    <td>{delivery.agent}</td>
                    <td>{delivery.region}</td>
                    <td>{delivery.eta}</td>
                    <td>{delivery.onTimeRate}%</td>
                    <td><Badge label={delivery.status} /></td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
          )}

          {activeView === "Risk Radar" && <RiskPanel risks={risks} refreshRadar={refreshRadar} full />}

          {activeView === "Analytics" && (
            <section className="grid gap-5 xl:grid-cols-2">
              <ChartPanel title="Order vs Return Trend" subtitle="Derived from current filtered dataset">
                <LineChart data={weeklyData}>
                  <CartesianGrid stroke="#2a303a" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#171b22", border: "1px solid #2a303a", borderRadius: 6 }} />
                  <Line type="monotone" dataKey="orders" stroke="#4fd1a5" strokeWidth={2} />
                  <Line type="monotone" dataKey="returns" stroke="#f97373" strokeWidth={2} />
                </LineChart>
              </ChartPanel>
              <ChartPanel title="Risk Severity Mix" subtitle={`${risks.length} active alerts`}>
                <PieChart>
                  <Pie dataKey="value" innerRadius={58} outerRadius={86} data={["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((severity) => ({ name: severity, value: risks.filter((risk) => risk.severity === severity).length }))}>
                    {["#ef4444", "#f97373", "#f7b955", "#5ab2ff"].map((color) => <Cell key={color} fill={color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#171b22", border: "1px solid #2a303a", borderRadius: 6 }} />
                </PieChart>
              </ChartPanel>
            </section>
          )}

          {activeView === "Users/Roles" && (
            <Panel title="Users & Roles" subtitle="RBAC model used by the Spring Boot backend and represented here for recruiter walkthroughs.">
              <DataTable headers={["Name", "Email", "Role", "Scope"]}>
                {users.map((user) => (
                  <tr key={user.email}>
                    <td className="py-3">{user.name}</td>
                    <td>{user.email}</td>
                    <td><Badge label={user.role} /></td>
                    <td className="text-slate-400">{user.scope}</td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
          )}

          {activeView === "System Events" && (
            <Panel title="System Events" subtitle="Kafka-style event stream generated by interactive actions in this browser session.">
              <div className="mb-4 flex flex-wrap gap-3">
                <button onClick={() => setEvents([])} className="rounded border border-line bg-ink px-3 py-2 text-sm">Clear events</button>
                <button onClick={resetDemo} className="inline-flex items-center gap-2 rounded border border-line bg-ink px-3 py-2 text-sm"><RotateCcw size={16} /> Reset demo data</button>
              </div>
              <div className="space-y-3">
                {events.length === 0 ? <Empty label="No events in the current browser session." /> : events.map((event) => (
                  <div key={event} className="flex items-start gap-3 rounded border border-line bg-ink/50 p-3 text-sm">
                    <span className="mt-1 h-2 w-2 rounded bg-mint" />
                    <span className="text-slate-300">{event}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <DatasetPanel resetDemo={resetDemo} />
        </div>
      </main>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded border border-line bg-panel p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function ChartPanel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactElement }) {
  return (
    <Panel title={title} subtitle={subtitle}>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function RiskPanel({ risks, refreshRadar, full = false }: { risks: Risk[]; refreshRadar: () => void; full?: boolean }) {
  return (
    <Panel title="Operational Risk Radar" subtitle="Explainable rule engine: stockout probability, capacity pressure, return clusters, damaged batches, delayed routes, and agent performance.">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded border border-line bg-ink px-2 py-1 text-xs text-slate-400">{risks.length} active risks</span>
          <span className="rounded border border-coral/30 bg-coral/10 px-2 py-1 text-xs text-coral">{risks.filter((risk) => ["HIGH", "CRITICAL"].includes(risk.severity)).length} severe</span>
        </div>
        <button onClick={refreshRadar} className="inline-flex items-center gap-2 rounded bg-mint px-3 py-2 text-sm font-semibold text-ink"><Radar size={17} /> Refresh radar</button>
      </div>
      <div className="grid gap-3">
        {(full ? risks : risks.slice(0, 4)).map((risk) => (
          <article key={risk.id} className="rounded border border-line bg-ink/50 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">{risk.title}</h3>
                <p className="text-sm text-slate-400">{risk.reason}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded border px-2 py-1 text-xs font-semibold ${severityClass(risk.severity)}`}>{risk.severity}</span>
                <span className="rounded bg-white/10 px-2 py-1 text-xs">Score {risk.score}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-slate-300">{risk.action}</span>
              <span className="text-slate-500">{risk.hub} / {risk.entity}</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function EnterpriseSurface({ tenant, portal, setActiveView, runAutopilot }: { tenant: Tenant; portal: Portal; setActiveView: (view: View) => void; runAutopilot: () => void }) {
  const credentialSet = tenant === "EU tenant"
    ? [
      ["Owner", "eu_owner@wareflow.dev", "Test12345#"],
      ["Manager", "eu_manager@wareflow.dev", "Test12345#"],
      ["Analyst", "eu_analyst@wareflow.dev", "Test12345#"],
      ["Delivery", "eu_agent@wareflow.dev", "Test12345#"],
      ["Customer", "eu_customer@wareflow.dev", "Test12345#"]
    ]
    : [
      ["Owner", "owner@wareflow.dev", "Test12345#"],
      ["Manager", "manager@wareflow.dev", "Test12345#"],
      ["Analyst", "analyst@wareflow.dev", "Test12345#"],
      ["Delivery", "agent@wareflow.dev", "Test12345#"],
      ["Customer", "customer@wareflow.dev", "Test12345#"]
    ];

  return (
    <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded border border-line bg-panel p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-mint"><ShieldCheck size={17} /> Enterprise Demo Surface</div>
            <h2 className="text-xl font-semibold">{portal} for {tenant === "EU tenant" ? "EuroFreight GmbH" : "Default Logistics"}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Multi-tenant demo mode, role-specific credentials, warehouse-scoped metrics, live event stream, and action buttons that mutate the operating dataset.
            </p>
          </div>
          <button onClick={runAutopilot} className="inline-flex items-center gap-2 rounded bg-mint px-3 py-2 text-sm font-semibold text-ink"><Zap size={17} /> Run Autopilot</button>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Tenant isolation", tenant === "EU tenant" ? "EU currency, metric ops" : "US currency, default ops"],
            ["Portal mode", portal === "Customer Portal" ? "Shipment tracking view" : "Internal TMS console"],
            ["Decision log", "Every action emits an event"],
            ["No paid APIs", "Works offline with synthetic state"]
          ].map(([label, value]) => (
            <div key={label} className="rounded border border-line bg-ink/50 p-3">
              <div className="text-xs text-slate-500">{label}</div>
              <div className="mt-1 text-sm font-semibold">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["Inventory", "Orders", "Deliveries", "Risk Radar", "System Events"] as View[]).map((view) => (
            <button key={view} onClick={() => setActiveView(view)} className="rounded border border-line bg-ink px-3 py-2 text-sm text-slate-300 hover:border-mint/60">{view}</button>
          ))}
        </div>
      </div>

      <div className="rounded border border-line bg-panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Try It Credentials</h2>
            <p className="text-sm text-slate-400">Demo accounts modeled after a real SaaS README.</p>
          </div>
          <Users className="text-mint" size={20} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase text-slate-500">
              <tr><th className="py-2">Role</th><th>Email</th><th>Password</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {credentialSet.map(([role, email, password]) => (
                <tr key={email}>
                  <td className="py-2">{role}</td>
                  <td><code className="rounded bg-white/5 px-2 py-1 text-xs">{email}</code></td>
                  <td><code className="rounded bg-white/5 px-2 py-1 text-xs">{password}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function AutopilotPanel({ risks, runAutopilot }: { risks: Risk[]; runAutopilot: () => void }) {
  return (
    <Panel title="Fulfillment Autopilot" subtitle="Human-in-the-loop planner: recommends actions, explains tradeoffs, and waits for approval.">
      <div className="grid gap-3 lg:grid-cols-3">
        {risks.map((risk, index) => (
          <article key={risk.id} className="rounded border border-line bg-ink/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className={`rounded border px-2 py-1 text-xs font-semibold ${severityClass(risk.severity)}`}>{risk.severity}</span>
              <span className="text-xs text-slate-500">Decision #{index + 1}</span>
            </div>
            <h3 className="font-semibold">{risk.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{risk.action}</p>
            <button onClick={runAutopilot} className="mt-4 inline-flex items-center gap-2 rounded bg-mint px-3 py-2 text-sm font-semibold text-ink"><CheckCircle2 size={16} /> Approve plan</button>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function WorkflowPanel({ simulateOrder, receiveStock, assignDelivery, refreshRadar }: { simulateOrder: () => void; receiveStock: () => void; assignDelivery: () => void; refreshRadar: () => void }) {
  const steps = [
    { label: "Order intake", detail: "Create order -> reserve stock -> publish ORDER_CREATED", icon: Boxes, action: simulateOrder },
    { label: "Inventory movement", detail: "Inbound/outbound updates -> LOW_STOCK_TRIGGERED", icon: ArrowDownUp, action: receiveStock },
    { label: "Delivery assignment", detail: "Assign agent -> update ETA -> DELIVERY_ASSIGNED", icon: Truck, action: assignDelivery },
    { label: "Risk evaluation", detail: "Recompute rules -> RISK_DETECTED with action", icon: Zap, action: refreshRadar }
  ];
  return (
    <Panel title="Workflow Operations Command" subtitle="This is the control layer. Each button mutates the browser-session dataset and emits a Kafka-style event.">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {steps.map(({ label, detail, icon: Icon, action }) => (
          <button key={label} onClick={action} className="rounded border border-line bg-ink/50 p-4 text-left hover:border-mint/60">
            <Icon className="mb-4 text-mint" size={22} />
            <div className="font-semibold">{label}</div>
            <div className="mt-2 text-sm text-slate-400">{detail}</div>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function DatasetPanel({ resetDemo }: { resetDemo: () => void }) {
  return (
    <section className="rounded border border-line bg-ink/70 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-mint"><Database size={17} /> Dataset in use</div>
          <p className="max-w-4xl text-sm text-slate-400">
            This running website uses a local synthetic logistics dataset stored in React state: 5 warehouses, 10 live products, 8 orders, 5 deliveries, 5 delivery agents, 4 RBAC users, and generated risk alerts/events.
            The backend scaffold also includes seed logic for the larger portfolio dataset: 100 products, 10,000 inventory transactions, 2,000 orders, 50 agents, 500 return requests, and 100 risk alerts.
          </p>
        </div>
        <button onClick={resetDemo} className="inline-flex items-center gap-2 rounded border border-line bg-panel px-3 py-2 text-sm"><RotateCcw size={16} /> Reset demo</button>
      </div>
    </section>
  );
}

function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="border-b border-line text-xs uppercase text-slate-500">
          <tr>{headers.map((header) => <th key={header} className="py-3 pr-4">{header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return <span className={`rounded px-2 py-1 text-xs ${statusClass(label)}`}>{label}</span>;
}

function Empty({ label }: { label: string }) {
  return (
    <div className="grid min-h-40 place-items-center rounded border border-dashed border-line bg-ink/40 text-sm text-slate-500">
      <div className="flex items-center gap-2"><CheckCircle2 size={18} /> {label}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
