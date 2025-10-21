import { Component, OnInit, ViewChild } from '@angular/core';
import { Firebase } from '../../services/firebase';
import { AfterViewInit } from '@angular/core';
import { getFirestore } from 'firebase/firestore';
import { ChartConfiguration, ChartType, Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { Header2 } from '../header2/header2';
import { Footer } from '../footer/footer';
import { BaseChartDirective } from 'ng2-charts';
import { JsonPipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
  imports: [Header2, Footer, BaseChartDirective, DecimalPipe, RouterLink],
})
// ...existing code...
export class ReportsComponent implements OnInit, AfterViewInit {
  private dataLoaded = false;
  completionRate = 0;
  cancellationRate = 0;
  public bookingsPieData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Completed', 'Cancelled'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#2ecc40', '#ff4136'],
        borderColor: ['#fff', '#fff'],
        borderWidth: 2,
      },
    ],
  };
  public bookingsPieOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'right' },
      title: { display: true, text: 'Completed vs Cancelled' },
    },
  };
  totalBookings = 0;
  completedJobs = 0;
  cancelledJobs = 0;
  averageRating = 0;
  ratings: number[] = [];
  // Reference to chart directive
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @ViewChild(BaseChartDirective) pieChart?: BaseChartDirective;

  public bookingsChartData: ChartConfiguration<'bar' | 'line'>['data'] = {
    labels: [],
    datasets: [
      {
        type: 'bar',
        data: [],
        label: 'Bookings',
        backgroundColor: '#217dbb',
        borderColor: '#217dbb',
        borderWidth: 2,
        order: 1,
      },
      {
        type: 'bar',
        data: [],
        label: 'Completed',
        backgroundColor: '#2ecc40',
        borderColor: '#2ecc40',
        borderWidth: 2,
        order: 2,
      },
      {
        type: 'bar',
        data: [],
        label: 'Cancelled',
        backgroundColor: '#ff4136',
        borderColor: '#ff4136',
        borderWidth: 2,
        order: 3,
      },
    ],
  };
  public bookingsChartOptions: ChartConfiguration<'bar' | 'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false },
      tooltip: {
        backgroundColor: '#217dbb',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#217dbb',
        borderWidth: 2,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(33,125,187,0.08)' },
        ticks: { color: '#217dbb', font: { weight: 'bold' } },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(33,125,187,0.08)' },
        ticks: { color: '#217dbb', font: { weight: 'bold' } },
      },
    },
  };
  public bookingsChartType: 'bar' | 'line' = 'bar';

  constructor(private firebase: Firebase) {}

  async ngOnInit() {
    await this.loadReportData();
  }

  // For future extensibility, e.g. polling or subscriptions
  ngOnDestroy() {
    // Clean up if needed
  }

  async loadReportData() {
    const db = getFirestore(this.firebase.app);
    const { getDocs, collection } = await import('firebase/firestore');
    // Fetch all jobs
    const jobsSnap = await getDocs(collection(db, 'jobs'));
    const jobs = jobsSnap.docs.map((doc) => doc.data());
    this.totalBookings = jobs.length;
    this.completedJobs = jobs.filter((j) => j['status'] === 'completed').length;
    this.cancelledJobs = jobs.filter((j) => j['status'] === 'cancelled').length;
    // Calculate rates
    this.completionRate =
      this.totalBookings > 0 ? (this.completedJobs / this.totalBookings) * 100 : 0;
    this.cancellationRate =
      this.totalBookings > 0 ? (this.cancelledJobs / this.totalBookings) * 100 : 0;

    // Prepare monthly bookings data for chart
    const monthlyCounts: { [key: string]: number } = {};
    jobs.forEach((job) => {
      // Parse createdAt date
      const dateStr = job['createdAt'];
      if (dateStr) {
        const d = new Date(dateStr);
        const label = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}`;
        monthlyCounts[label] = (monthlyCounts[label] || 0) + 1;
      }
    });
    // Sort labels chronologically
    const sortedLabels = Object.keys(monthlyCounts).sort();
    this.bookingsChartData.labels = sortedLabels;
    const monthlyData = sortedLabels.map((lbl) => monthlyCounts[lbl]);
    // Completed jobs per month
    const completedMonthly: { [key: string]: number } = {};
    jobs.forEach((job) => {
      const dateStr = job['createdAt'];
      if (dateStr && job['status'] === 'completed') {
        const d = new Date(dateStr);
        const label = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}`;
        completedMonthly[label] = (completedMonthly[label] || 0) + 1;
      }
    });
    const completedData = sortedLabels.map((lbl) => completedMonthly[lbl] || 0);
    // Cancelled jobs per month
    const cancelledMonthly: { [key: string]: number } = {};
    jobs.forEach((job) => {
      const dateStr = job['createdAt'];
      if (dateStr && job['status'] === 'cancelled') {
        const d = new Date(dateStr);
        const label = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}`;
        cancelledMonthly[label] = (cancelledMonthly[label] || 0) + 1;
      }
    });
    const cancelledData = sortedLabels.map((lbl) => cancelledMonthly[lbl] || 0);
    this.bookingsChartData.datasets[0].data = monthlyData; // bookings line
    this.bookingsChartData.datasets[1].data = completedData; // completed line
    this.bookingsChartData.datasets[2].data = cancelledData; // cancelled line
    if (this.bookingsChartData.datasets[3]) this.bookingsChartData.datasets[3].data = monthlyData; // bar
    if (this.bookingsChartData.datasets[4]) this.bookingsChartData.datasets[4].data = monthlyData; // area
    // Update pie chart data and trigger update
    this.bookingsPieData.datasets[0].data = [this.completedJobs, this.cancelledJobs];
    this.dataLoaded = true;
    this.updateChartsIfReady();

    // Fetch all reviews for average rating
    const reviewsSnap = await getDocs(collection(db, 'reviews'));
    const reviews = reviewsSnap.docs.map((doc) => doc.data());
    // Convert ratings to numbers if needed
    this.ratings = reviews
      .map((r) => {
        const val = r['rating'];
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
        return null;
      })
      .filter((r): r is number => typeof r === 'number' && !isNaN(r));
    if (this.ratings.length > 0) {
      this.averageRating =
        Math.round((this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length) * 10) / 10;
    } else {
      this.averageRating = 0;
    }
  }

  ngAfterViewInit(): void {
    this.updateChartsIfReady();
  }

  private updateChartsIfReady(): void {
    if (this.dataLoaded && this.pieChart && this.chart) {
      this.pieChart.update();
      this.chart.update();
    }
  }
}
