import React, { useState } from 'react';
import axios from 'axios';
import {
    Table,
    Button,
    Input,
    Tag,
    Slider,
    Tabs,
    Card,
    Spin,
    message,
    Row,
    Col,
    Switch,
    Statistic
} from 'antd';
import { DownloadOutlined, SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { Pie, Bar } from '@ant-design/plots';
import { motion } from 'framer-motion';
import "./Home.css";

const { TabPane } = Tabs;

const YouTubeComments = () => {
    const [url, setUrl] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [csvLink, setCsvLink] = useState(null);
    const [threshold, setThreshold] = useState(0.5);
    const [showOnlyToxic, setShowOnlyToxic] = useState(false);

    const fetchComments = async () => {
        if (!url) {
            message.error('Please enter a valid YouTube URL');
            return;
        }

        setLoading(true);
        setError(null);
        setComments([]);
        setCsvLink(null);

        try {
            const response = await axios.post('http://localhost:5000/toxic_comments', { url });
            if (response.data.results) {
                setComments(response.data.results);
                setCsvLink(response.data.csv_download);
            } else {
                setError('No comments found or an error occurred');
            }
        } catch (err) {
            setError(`Error fetching comments: ${err.response?.data?.error || err.message}`);
        }
        setLoading(false);
    };

    const getSeverityTag = (score) => {
        if (score > 0.9) return <Tag color="red">High 🔥</Tag>;
        if (score > 0.5) return <Tag color="orange">Medium ⚠️</Tag>;
        return <Tag color="green">Low ✅</Tag>;
    };

   

    const filteredComments = showOnlyToxic
        ? comments.filter(comment => comment.score > threshold)
        : comments;

    const columns = [
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            render: text => <strong>{text}</strong>
        },
        {
            title: 'Comment Snippet',
            dataIndex: 'text',
            key: 'text',
            render: text => <span>{text.length > 80 ? `${text.substring(0, 80)}...` : text}</span>
        },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp'
        },
        {
            title: 'Likes',
            dataIndex: 'likes',
            key: 'likes'
        },
        {
            title: 'Visibility',
            dataIndex: 'visibility',
            key: 'visibility'
        },
        {
            title: 'Toxic Score',
            dataIndex: 'score',
            key: 'score',
            render: (score) => (
                <div>
                    {getSeverityTag(score)} <br />
                    <small>({(score * 100).toFixed(1)}%)</small>
                </div>
            ),
        },
    ];

    const toxicCount = comments.filter(comment => comment.score > threshold).length;
    const nonToxicCount = comments.length - toxicCount;
    const pieData = [
        { type: 'Toxic', value: toxicCount },
        { type: 'Non-Toxic', value: nonToxicCount }
    ];

    const barData = [
        { type: 'Toxic', value: toxicCount },
        { type: 'Non-Toxic', value: nonToxicCount }
    ];

    const handleReset = () => {
        setUrl('');
        setComments([]);
        setCsvLink(null);
        setThreshold(0.5);
        setError(null);
        setShowOnlyToxic(false);
    };

    return (
        <motion.div className="container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card title="🎥 YouTube Comment Analyzer" bordered={false} style={{ marginBottom: 24 }}>
                <Input
                    placeholder="Enter YouTube URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="input-url"
                    style={{ marginBottom: '1rem' }}
                />

                <div className="button-container" style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<SearchOutlined />} onClick={fetchComments} loading={loading} style={{ marginRight: 10 }}>
                        Analyze Comments
                    </Button>

                    <Button icon={<ReloadOutlined />} onClick={handleReset} style={{ marginRight: 10 }}>
                        Reset
                    </Button>

                    {csvLink && (
                        <Button type="primary" icon={<DownloadOutlined />} href={`http://localhost:5000/${csvLink}`} download>
                            Download CSV
                        </Button>
                    )}
                </div>

                <div style={{ marginBottom: 20 }}>
                    <strong>🎚 Adjust Threshold:</strong>
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={threshold}
                        onChange={setThreshold}
                       
                    />
                    <p style={{ fontSize: '1.2rem' }}>Current  Threshold: <strong>{threshold.toFixed(2)}</strong> </p>
                </div>

                {comments.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                        <Switch
                            checked={showOnlyToxic}
                            onChange={() => setShowOnlyToxic(!showOnlyToxic)}
                            style={{ marginRight: 10 }}
                        />
                        Show Only Toxic Comments
                    </div>
                )}
            </Card>

            {loading && <Spin tip="Analyzing Comments..." size="large" />}

            {error && <p className="error-text">{error}</p>}

            {comments.length > 0 && (
                <>
                    <Row gutter={16} className="card-stats" style={{ marginBottom: 24 }}>
                        <Col span={8}>
                            <Card>
                                <Statistic title="Total Comments" value={comments.length} />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic title="Toxic Comments" value={toxicCount} valueStyle={{ color: '#ff4d4f' }} />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic title="Non-Toxic Comments" value={nonToxicCount} valueStyle={{ color: '#52c41a' }} />
                            </Card>
                        </Col>
                    </Row>

                    <Tabs defaultActiveKey="1">
                        <TabPane tab="📋 Comment Table" key="1">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                                <div className="table-container">
                                    <Table
                                        dataSource={filteredComments}
                                        columns={columns}
                                        rowKey={(record, index) => index}
                                        pagination={{ pageSize: 8 }}
                                        expandable={{
                                            expandedRowRender: (record) => (
                                                <div style={{ padding: 12 }}>
                                                    <strong>📜 Full Comment:</strong>
                                                    <p style={{ marginTop: 8 }}>{record.text}</p>
                                                </div>
                                            ),
                                            rowExpandable: record => record.text.length > 80
                                        }}
                                        scroll={false}
                                    />
                                </div>
                            </motion.div>
                        </TabPane>

                        <TabPane tab="📊 Pie Chart" key="2">
                            <Card title="Toxic vs Non-Toxic Comments">
                                <Pie
                                    data={pieData}
                                    angleField="value"
                                    colorField="type"
                                    radius={0.8}
                                    label={{
                                        type: 'inner',
                                        content: '{percentage}',
                                        style: { fontSize: 14 },
                                    }}
                                    color={['#ff4d4f', '#52c41a']}
                                />
                            </Card>
                        </TabPane>

                        <TabPane tab="📉 Bar Chart" key="3">
                            <Card title="Comment Type Distribution">
                                <Bar
                                    data={barData}
                                    xField="value"
                                    yField="type"
                                    seriesField="type"
                                    color={['#ff7875', '#95de64']}
                                    label={{ position: 'middle' }}
                                    barWidthRatio={0.5}
                                />
                            </Card>
                        </TabPane>
                        
                    </Tabs>
                </>
            )}
        </motion.div>
    );
};

export default YouTubeComments;

