"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SiBitcoin } from "react-icons/si";
import { SiTether } from "react-icons/si";
import { Button } from "../components/ui/button";
import {
  createChart,
  CrosshairMode,
  IChartApi,
  CandlestickData,
  UTCTimestamp,
  CandlestickSeries,
} from "lightweight-charts";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useGetCandles } from "../hooks/useCandles";
import { Candle } from "../types/candle.type";
import { useGetBalances } from "../hooks/useBalance";
import IntervalSelector from "../components/IntervalSelector";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";
import OrdersSection from "../components/OrdersSection";
import DepositModal from "../components/DepositModal";

const Marketplace = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ReturnType<IChartApi["addSeries"]> | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [selectedInterval, setSelectedInterval] = useState("1m");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const { data: balanceData, isLoading: balanceLoading } = useGetBalances();

  const totalBalance =
    balanceData?.balances?.reduce((total, balance) => {
      if (balance.symbol === "USDC") {
        const balanceInDollars =
          balance.balance / Math.pow(10, balance.decimals);
        return total + balanceInDollars;
      }
      return total;
    }, 0) || 0;

  const { data, isLoading, isError } = useGetCandles(
    selectedInterval,
    0,
    0,
    "BTC_USDC",
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const initChart = () => {
      if (!containerRef.current) return;

      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }

      const parentElement = containerRef.current.parentElement;
      const rect =
        parentElement?.getBoundingClientRect() ||
        containerRef.current.getBoundingClientRect();

      const containerWidth = Math.max(rect.width - 20, 600);
      const containerHeight = Math.max(rect.height - 20, 400);

      const chart = createChart(containerRef.current, {
        width: containerWidth,
        height: containerHeight,
        layout: {
          background: { color: "#ffffff" },
          textColor: "#374151",
          fontSize: 12,
        },
        crosshair: { mode: CrosshairMode.Normal },
        grid: {
          vertLines: { color: "#e5e7eb" },
          horzLines: { color: "#e5e7eb" },
        },
        timeScale: { borderColor: "#d1d5db" },
        rightPriceScale: { borderColor: "#d1d5db" },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
      });

      chartRef.current = chart;

      const series = chart.addSeries(CandlestickSeries, {
        upColor: "#00b050",
        downColor: "#ff4976",
        borderDownColor: "#ff4976",
        borderUpColor: "#00b050",
        wickDownColor: "#838ca1",
        wickUpColor: "#838ca1",
      });
      seriesRef.current = series;

      const ro = new ResizeObserver((entries) => {
        if (entries[0] && chartRef.current) {
          const { width, height } = entries[0].contentRect;
          if (width > 100 && height > 100) {
            chart.applyOptions({ width: width - 10, height: height - 10 });
            chart.timeScale().fitContent();
          }
        }
      });

      if (containerRef.current.parentElement) {
        ro.observe(containerRef.current.parentElement);
      }
      resizeObserverRef.current = ro;
    };

    const timer = setTimeout(initChart, 100);

    return () => {
      clearTimeout(timer);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !data || isLoading || isError) return;

    const mapped: CandlestickData[] = data.map((row: Candle) => {
      let timestamp: number;
      const timeValue = row.bucket ?? row.time ?? "";

      if (typeof timeValue === "string") {
        const parsedNumber = Number(timeValue);
        if (!isNaN(parsedNumber)) {
          timestamp = parsedNumber;
          if (timestamp > 1000000000000) {
            timestamp = Math.floor(timestamp / 1000);
          }
        } else {
          timestamp = Math.floor(new Date(timeValue).getTime() / 1000);
        }
      } else {
        timestamp = timeValue;
        if (timestamp > 1000000000000) {
          timestamp = Math.floor(timestamp / 1000);
        }
      }

      return {
        time: timestamp as UTCTimestamp,
        open: Number(row.open),
        high: Number(row.high),
        low: Number(row.low),
        close: Number(row.close),
        volume: Number(row.volume),
      };
    });

    mapped.sort((a, b) => (a.time as number) - (b.time as number));

    seriesRef.current.setData(mapped);
    chartRef.current?.timeScale().fitContent();
  }, [data, isLoading, isError]);

  return (
    <div className="w-full h-screen flex flex-col">
      <header className="w-full border-b border-[var(--border)] px-3 py-2 sm:px-4 md:px-6 flex-shrink-0 bg-[#FFF]">
        <div className="mx-auto max-w-[1260px]">
          <div className="flex items-center justify-end mb-4 md:mb-0">
            <button
              className="md:hidden p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <div className="hidden md:flex md:items-center md:justify-between">
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-1">
                  <SiBitcoin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="font-semibold text-black font-ibm-plex-mono text-xs sm:text-sm md:text-base">
                    BTC
                  </span>
                </div>
                <span className="text-gray-400 text-xs sm:text-sm">/</span>
                <div className="flex items-center gap-1">
                  <SiTether className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="font-semibold text-black font-ibm-plex-mono text-xs sm:text-sm md:text-base">
                    USDT
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 pl-4 sm:pl-6 lg:pl-8 border-l border-[var(--border)]">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                    Timeframe:
                  </span>
                  <IntervalSelector
                    selectedInterval={selectedInterval}
                    onIntervalChange={setSelectedInterval}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                  Balance:
                </span>
                <span className="text-sm sm:text-base md:text-lg font-semibold text-black font-ibm-plex-mono">
                  {balanceLoading
                    ? "Loading..."
                    : `$${totalBalance.toLocaleString()}`}
                </span>
              </div>
              <Button size="sm" onClick={() => setIsDepositModalOpen(true)} className="text-xs sm:text-sm px-2 sm:px-4">
                Deposit
              </Button>
            </div>
          </div>

          <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
            <div className="space-y-4 pt-4 border-t border-[var(--border)]">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-50 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-1">
                  <SiBitcoin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="font-semibold text-black font-ibm-plex-mono text-xs sm:text-sm">
                    BTC
                  </span>
                </div>
                <span className="text-gray-400 text-xs sm:text-sm">/</span>
                <div className="flex items-center gap-1">
                  <SiTether className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="font-semibold text-black font-ibm-plex-mono text-xs sm:text-sm">
                    USDT
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                    Balance:
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-black font-ibm-plex-mono">
                    {balanceLoading
                      ? "Loading..."
                      : `$${totalBalance.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                    Timeframe:
                  </span>
                  <IntervalSelector
                    selectedInterval={selectedInterval}
                    onIntervalChange={setSelectedInterval}
                    className="w-full"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => setIsDepositModalOpen(true)}
                    className="w-full text-xs sm:text-sm"
                  >
                    Deposit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        className="flex-1 overflow-hidden pb-20 md:pb-0"
        style={{ height: "calc(100vh - 120px)" }}
      >
        <PanelGroup direction="horizontal" className="h-full">
          <Panel
            defaultSize={20}
            minSize={15}
            maxSize={30}
            className="hidden lg:block"
          >
            <LeftSideBar />
          </Panel>

          <PanelResizeHandle className="hidden lg:block resize-handle-horizontal" />

          <Panel defaultSize={60} minSize={40} className="lg:min-w-0 w-full">
            <PanelGroup direction="vertical" className="h-full">
              <Panel defaultSize={75} minSize={50}>
                <div className="h-full relative bg-white">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                      <div className="text-center">
                        <div className="text-black text-lg mb-2">
                          Loading chart data...
                        </div>
                        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
                      </div>
                    </div>
                  )}
                  {isError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                      <div className="text-center p-4">
                        <div className="text-red-600 text-lg mb-2">
                          Error loading chart data
                        </div>
                        <button
                          onClick={() => window.location.reload()}
                          className="bg-white border-2 border-black text-black px-4 py-2 rounded-4xl text-sm transition-colors hover:bg-black hover:text-white"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  )}
                  <div
                    ref={containerRef}
                    className="w-full h-full"
                    style={{
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>
              </Panel>

              <PanelResizeHandle className="resize-handle-vertical" />

              <Panel defaultSize={25} minSize={15} maxSize={50}>
                <div className="h-full border-t border-gray-200 bg-white">
                  <OrdersSection />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="hidden lg:block resize-handle-horizontal" />

          <Panel
            defaultSize={20}
            minSize={15}
            maxSize={30}
            className="hidden lg:block"
          >
            <RightSideBar selectedSymbol={"BTC_USDC"} />
          </Panel>
        </PanelGroup>
      </div>

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />
    </div>
  );
};

export default Marketplace;
